from flask import Flask, url_for
from flask_script import Manager, Server
from werkzeug.security import generate_password_hash
from database.model import db, lm, User
from sqlalchemy.exc import OperationalError
import os

def create_app():
    """
    Application and database initialization
    """

    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'somenibba'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/sql.database'
    app.app_context().push()

    db.init_app(app)
    lm.init_app(app)
    lm.login_view = 'auth.login'
    db.create_all()
    create_admin_account()

    @lm.user_loader
    def load_user(uID):
        return User.query.get(int(uID))

    """
    Blueprints and utility functions
    """

    from auth import auth_bp
    app.register_blueprint(auth_bp)
    
    from products import products_bp
    app.register_blueprint(products_bp)

    from main import main_bp
    app.register_blueprint(main_bp)

    @app.context_processor
    def override_url_for():
        return dict(url_for=dated_url_for)

    def dated_url_for(endpoint, **values):
        if endpoint == 'static':
            filename = values.get('filename', None)
            if filename:
                file_path = os.path.join(app.root_path,
                                         endpoint, filename)
                values['q'] = int(os.stat(file_path).st_mtime)
        return url_for(endpoint, **values)

    return app

def create_admin_account():
    user = User.query.filter_by(uEmail='admin@nhatamgiac.vn').first()

    if not user:
        uEmail = 'admin@nhatamgiac.vn'
        uName = 'Admin'
        uPassword = generate_password_hash('06fc7c995ba8a31d19ab', salt_length=32)
        uPermission = 'admin'
        admin = User(uEmail=uEmail, uName=uName, uPassword=uPassword, uPermission=uPermission)
        db.session.add(admin)
        db.session.commit()

def app_context_push():
    app.app_context().push()

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='5000',debug=True)
