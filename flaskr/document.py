import fitz
import json
from flask import (
    Blueprint, flash, g, redirect, render_template, send_file, request, session, url_for, abort, jsonify
)
import pymongo
from bson.objectid import ObjectId
import base64
from werkzeug.utils import secure_filename
import os
import errno

myclient = pymongo.MongoClient("mongodb+srv://limarcospap:cQ6oyLLGIukkPvnd@cluster0.gahcw.mongodb.net/test?authSource=admin&replicaSet=atlas-708nws-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true")
bd = myclient["labprog"]
documents_col = bd["documentos"]

bp = Blueprint('document', __name__, url_prefix='/document')

DIR_PATH = os.path.dirname(os.path.realpath(__file__))
UPLOAD_FOLDER = os.path.join(DIR_PATH, "static/file") #estabelece a rota para o qual o servidor upa os arquivos

@bp.route('/get-pfc', methods=(['GET','POST'])) 
def getPfc():
  cursor = documents_col.find()
  list_cursor = list(cursor)

  for obj in list_cursor:
      obj['_id'] = str(obj['_id'])

  return  {"data": list_cursor}, 200, {'ContentType': 'application/json'}

@bp.route('/upload-pfc', methods=(['GET','POST']))
def uploadPfc():
    print(request.form)
    data_dic = {}
    for key in request.form.keys():
      data_dic[key] = request.form[key]
    aux = data_dic['filename']
    data_dic['filename'] = secure_filename(aux) #armazena no banco o nome do arquivo
    documents_col.insert_one(data_dic)

    return "sucesso", 200

@bp.route('/download/<fileToDownload>')
def downloadPfc(fileToDownload):
    title = fileToDownload; #pega o titulo do arquivo como parametro
    cursor = documents_col.find_one({"titulo": title}) #recupera no banco as informações do arquivo, junto com o nome do arquivo
    filename = cursor['filename']
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    return send_file(filepath)

@bp.route('/upload-pfc-file', methods=(['GET','POST']))
def uploadPfcFile():
    file = request.files['file']
    filename = file.filename

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    file.save(filepath)

    return "sucesso", 200

@bp.route('/search-pfc', methods=(['GET','POST']))
def searchPfc():
  obj = {}
  if request.method == 'GET':
    obj = request.args
  else:
    obj = request.form

  cursor = documents_col.find({'nome': {'$regex': obj['search'], '$options': 'i'}})
  list_cursor = list(cursor)

  for obj in list_cursor:
      obj['_id'] = str(obj['_id'])

  return  json.dumps(list_cursor), 200, {'ContentType': 'application/json'}

@bp.route('/manage-pfc', methods=(['GET','POST']))
def managePfc():
  data_dic = {}
  for key in request.form.keys() :
    if key != "id":
      data_dic[key] = request.form[key]
  documents_col.find_one_and_update(
    {"_id" : ObjectId(request.form["id"])},
    {"$set":
            data_dic
    },upsert=True
)
  return "sucesso", 200

#Funções que retornam os dados do PDF (colocar em um módulo separado depois...)

def localizar_pagina(texto, doc):
        pagina = 0
        for page in doc:
            pagina += 1
            if (page.get_text().lower().find(texto) != -1):
                return pagina
        return 0

def extrai_texto_parametro(parametro, page):
    texto = page.get_text()
    param_tamanho = len(parametro)
    param_posicao = texto.lower().find(parametro)
    if param_posicao != -1:
        texto = texto[param_posicao + param_tamanho:]
    return texto

def detectar_tipo(doc):
    tipos = ['pfc', 'projeto', 'tese', 'dissertação']
    tipos_dict = {'pfc':'pfc', 'projeto':'pfc', 'tese': 'tese', 'dissertação': 'dis'}
    for tipo in tipos:
        if (doc[1].get_text().lower().find(tipo)) != -1:    
            return tipos_dict[tipo]
    
  
    return 'tipo nao encontrado'

def retornar_titulo(doc):
    return doc[0].getTextbox(fitz.Rect((0,400),(600,650)))

def retornar_autores(doc):
    return doc[0].getTextbox(fitz.Rect((0,200),(600,400)))

def retornar_palavras_chave(doc):
    pagina = localizar_pagina("palavras-chave:", doc)
    if (pagina) != 0:
         return extrai_texto_parametro("palavras-chave:", doc[pagina-1])
    return 'palavras-chave nao encontradas'
def retornar_resumo(doc):
    resumo_pagina_numero = localizar_pagina("resumo", doc)
    pagina_resumo = doc[resumo_pagina_numero-1]
    resumo_texto_pagina = pagina_resumo.get_text()
    return resumo_texto_pagina[resumo_texto_pagina.lower().find("resumo")+6:]

def retornar_orientadores(doc):
    for pag in doc:
        rect = pag.search_for("orientador")
        if rect:
            rect[0] = fitz.Rect(rect[0].top_left, (rect[0].x1+200, rect[0].y1+50))
            return pag.getTextbox(rect[0])
    return 'nao foram encontrados orientadores'

@bp.route('/get-pdf-data')
def getPdfData():
  filename = request.args.get('filename')
  print(filename)
  with fitz.open(UPLOAD_FOLDER+'/'+filename) as doc:
    titulo = retornar_titulo(doc)
    autores = retornar_autores(doc)
    resumo = retornar_resumo(doc)
    palavras_chave = retornar_palavras_chave(doc)
    tipo = detectar_tipo(doc)
    orientadores = retornar_orientadores(doc)
  data = {'titulo':titulo, 'autores':autores, 'resumo':resumo, 'palavras_chave':palavras_chave, 'tipo': tipo,  'orientadores':orientadores}
  return data, 200
