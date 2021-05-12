import os

from flask import Flask
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    app.run(host="0.0.0.0",port=8081)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/')
    def home():

        return render_template('./index.html')
       
    @app.route('/footer')
    def footer():
        return render_template('./components/footer/footer.html')
    @app.route('/navbar')
    def navbar():
        return render_template('./components/navbar/navbar.html')
    @app.route('/search')
    def search():
        return render_template('./document/search/search.html')
    @app.route('/modal')
    def modal():
        return render_template('./components/modal/modal.html')
    @app.route('/create-user')
    def createUser():
        return render_template('./user/create/createUser.html')
    @app.route('/manage-document')
    def manageDocument():
        return render_template('./document/manage/manageDocument.html', titulo = request.args.get("titulo"), autores = request.args.get("autores"), orientadores = request.args.get("orientadores"), InstEns = request.args.get("InstEns"), keyword = request.args.get("keyword"), resumo = request.args.get("resumo"), id = request.args.get("id"))
    @app.route('/create-document')
    def createDocument():
        return render_template('./document/create/createDocument.html')

    @app.route('/register', methods=('GET', 'POST'))
    def register():
        if request.method == 'POST':
            print(request.form)
            for key in request.form.keys():
                print(key)
            return "deu certo!"

    from . import auth
    app.register_blueprint(auth.bp)

    from . import document
    app.register_blueprint(document.bp)

    return app