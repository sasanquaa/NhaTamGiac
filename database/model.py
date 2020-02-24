from flask_login import UserMixin, LoginManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
lm = LoginManager()

class User(UserMixin, db.Model):
    
    id = db.Column('user_id',db.Integer, primary_key=True)
    name = db.Column('user_name',db.String(64))
    email = db.Column('user_email',db.String(128), unique=True)
    password = db.Column('user_password',db.String(64))
    permission = db.Column('user_permission',db.String(12))

class Product(db.Model):

    name = db.Column('product_name',db.String(512),primary_key=True)
    brand = db.Column('product_brand',db.String(128))
    status = db.Column('product_status',db.Boolean)
    price = db.Column('product_price',db.Integer)
    size = db.Column('product_size',db.String(128))
    description = db.Column('product_description',db.Text)

