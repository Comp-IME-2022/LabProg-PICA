from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db



bp = Blueprint('docs', __name__)

@bp.route('/')
def index():
    db = get_db()
    posts = db.execute(
        'SELECT *'
        ' FROM docs'
        ' ORDER BY created DESC'
    ).fetchall()
    return render_template('index.html', posts=posts)


@bp.route('/upload', methods=('POST'))
@login_required
def upload():
    if request.method == 'POST':
        title = request.form['titulo']
        author = request.form['autores']
        supervisors = request.form['orientadores']
        college = request.form['InstEns']
        type_doc = request.form['tipo']
        key_words = request.form['keyword']
        abstract = request.form['resumo']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'INSERT INTO docs (title, author_name, supervisors, college, type_doc, key_words,abstract)'
                ' VALUES (?, ?, ?, ?, ?, ?, ?)',
                (title, author, supervisors, college, type_doc, key_words, abstract)
            )
            db.commit()
            return redirect(url_for('docs.index'))

    return render_template('document/create/createDocument.html')

def get_docs(id):
    post = get_db().execute(
        'SELECT *'
        ' FROM docs d'
        ' WHERE d.title= ?',
        (id,)
    ).fetchone()

    if post is None:
        abort(404, "Docs id {0} doesn't exist.".format(id))

    return post

@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    post = get_post(id)

    if request.method == 'POST':
        title = request.form['titulo']
        author = request.form['autores']
        supervisors = request.form['orientadores']
        college = request.form['InstEns']
        type_doc = request.form['tipo']
        key_words = request.form['keyword']
        abstract = request.form['resumo']
        error = None

        if not title:
            error = 'Title is required.'

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'UPDATE docs SET title = ?, author_name = ?, supervisors = ?, college = ?, type_doc = ?, key_words = ?, abstract = ?'
                ' WHERE id = ?',
                (title, author, supervisors, college, type_doc, key_words, abstract, id)
            )
            db.commit()
            return redirect(url_for('docs.index'))

    return render_template('blog/update.html', post=post)

@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
    get_docs(id)
    db = get_db()
    db.execute('DELETE FROM docs WHERE id = ?', (id,))
    db.commit()
    return redirect(url_for('blog.index'))
