import functools
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
    filename = secure_filename(file.filename)

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