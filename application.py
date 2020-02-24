from flask import Flask, url_for
from flask_script import Manager, Server
from werkzeug.security import generate_password_hash
from database.model import db, lm, User
import os


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'somenibba'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database/sql.database'

    db.init_app(app)
    lm.init_app(app)
    lm.login_view = 'auth.login'

    @lm.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

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

    with app.app_context():
        create_admin_account()

    return app

def create_admin_account():
    user = User.query.filter_by(email='admin@nhatamgiac.vn').first()

    if not user:
        email = 'admin@nhatamgiac.vn'
        name = 'Admin'
        password = generate_password_hash('06fc7c995ba8a31d19ab', salt_length=32)
        permission = 'admin'
        admin = User(email=email, name=name, password=password, permission=permission)
        db.session.add(admin)
        db.session.commit()

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='5000')
