Backend para a aplicação Frontend desenvolvida em 15 de março, para a VE da atividade de Lab Prog 3.

Desenvolvida em python, com a framework Flask.

Guia de instalação do Flask:

1) Criar um Virtual Environment: 

$ mkdir myproject
$ cd myproject
$ python3 -m venv venv

2) Ativar o Virtual Environment:

$ . venv/bin/activate

3) Instalar o Flask (automaticamente ele já instala todas as dependências)

$ pip3 install Flask
$ pip3 install flask-login


Guia de como rodar um servidor flask: 

Seja o servidor flask com o nome server.py, rode-o da seguinte forma:

$ flask init-db

$ export FLASK_APP=hello.py
$ flask run
 * Running on http://127.0.0.1:5000/
