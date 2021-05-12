import functools
import json
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, abort, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash
import time

bp = Blueprint('auth', __name__, url_prefix='/auth')

import pymongo
myclient = pymongo.MongoClient("mongodb+srv://limarcospap:cQ6oyLLGIukkPvnd@cluster0.gahcw.mongodb.net/test?authSource=admin&replicaSet=atlas-708nws-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true")
bd = myclient["labprog"]
users_col = bd["usuarios"]

@bp.route('/register', methods=(['POST'])) #fazer o login ser unico
def register():
    data_dic = {}
    for key in request.form.keys():
        data_dic[key] = request.form[key]

    data_dic['senha'] = generate_password_hash(data_dic['senha'])
    data_dic['admin'] = data_dic['admin'] == 'true'
    
    try:
      users_col.insert_one(data_dic)
      return json.dumps({'success': True}), 200, {'ContentType': 'application/json'} 
    except(e):
      return json.dumps(e), 500, {'ContentType': 'application/json'}

@bp.route('/findall')
def findall():
  resp = ""
  for x in users_col.find():
    resp = resp + str(x)+"\n"
  return resp
      
@bp.route('/insert_one')
def insertall():
  json_obj = {'nome': 'Gustavo', 'sobrenome': 'Testoni', 'nascimento': '15/02/1997', 'login': 'gcasq', 'senha': '123456', 'admin': true}
  x = users_col.insert_one(json_obj)
  return "deu certo"

@bp.route('/login', methods=(['POST']))
def login():
  error = None
  user = users_col.find_one({"login": request.form["login"]})

  if user is None:
    error = 'username'
    g.loginError = True
  elif not check_password_hash(user["senha"], request.form["senha"]):
    error = 'password'
    g.loginError = True
      
  if error is None:
    session.clear()
    session['user_id'] = str(user['_id'])
    session['admin'] = bool(user['admin'])
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'} 
    
  return json.dumps({'error': error}), 403, {'ContentType': 'application/json'}


@bp.before_app_request
def load_logged_in_user():
  user_id = session.get('user_id')
  if user_id is None:
    g.user = False
  else:
    g.user = users_col.find_one({"_id": user_id})

@bp.route('/logout')
def logout():
  session.clear()
  return redirect(url_for('home'))

def login_required(view):
  @functools.wraps(view)
  def wrapped_view(**kwargs):
    if g.user is None:
      return redirect(url_for('auth.login'))
    return view(**kwargs)
  return wrapped_view