from flask_login import UserMixin, LoginManager
from flask_sqlalchemy import SQLAlchemy
import ast
import os

db = SQLAlchemy()
lm = LoginManager()

"""
This contains tables for the database.

Naming conventions:
    pXXX - productXXX
    uXXX - userXXX
"""


class User(UserMixin, db.Model):
    
    uID = db.Column('uID', db.Integer, primary_key=True)
    uName = db.Column('uName', db.String(64))
    uEmail = db.Column('uEmail', db.String(128), unique=True)
    uPassword = db.Column('uPassword', db.String(64))
    uPermission = db.Column('uPermission', db.String(12))

    def __repr__(self):
        return '{} - {}'.format(self.uID, self.uName)

    def get_id(self):
        return self.uID

    def as_dict(self):
        return {'uName': self.uName,
                'uEmail': self.uEmail,
                'uPassword': self.uPassword,
                'uPermission': self.uPermission}

class Product(db.Model):

    pID = db.Column('pID', db.String(256), primary_key=True)
    pName = db.Column('pName', db.String(256))
    pBrand = db.Column('pBrand', db.String(128))
    pStatus = db.Column('pStatus', db.Boolean)
    pPrice = db.Column('pPrice', db.Numeric)
    pSize = db.Column('pSize', db.String(128))
    pIPath = db.Column('pIPath', db.String(256))
    pDPath = db.Column('pDPath', db.String(256))


    """
    For printing purposes
    """
    def __repr__(self):
        return '{} - {}'.format(self.pID, self.pName)

    """
    Return a dictionary with neccesary parsed information to use with AJAX
    """
    def as_dict(self):
        imgs = []
        with open(self.pDPath) as f:
            description = f.read()
        for img in os.listdir(self.pIPath):
            imgs.append(os.path.join(self.pIPath, img))
        return {'pID': self.pID,
                'pName': self.pName,
                'pBrand': self.pBrand,
                'pStatus': 'Còn hàng' if self.pStatus else 'Hết hàng',
                'pPrice': '{:,d}'.format(self.pPrice.__int__()).replace(',','.'),
                'pSize': ast.literal_eval(self.pSize),
                'pDescription': description,
                'pImages': imgs,
                'pImagesCount': len(imgs)}

