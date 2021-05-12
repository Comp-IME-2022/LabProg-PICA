from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://limarcospap:cQ6oyLLGIukkPvnd@cluster0.gahcw.mongodb.net/test?authSource=admin&replicaSet=atlas-708nws-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
mongo = PyMongo(app)

