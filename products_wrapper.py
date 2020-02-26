import os
import json
import shutil
import random
from database.model import db, Product
from checksumdir import dirhash


COL_MAP = {
        '1': 'pName',
        '2': 'pBrand',
        '3': 'pStatus',
        '4': 'pSize',
        '5': 'pPrice'
        }

def pk_1(**kwargs):
    pID = kwargs['value'].lower().replace(' ','-')
    if pID == kwargs['pID']: return 0
    if kwargs['self'].get_product(pID) != None: return 1

def pk_3(**kwargs):
    if kwargs['value'] == 'Còn hàng':
        return 1
    else:
        return 0

def pk_4(**kwargs):
    return str(kwargs['request'].getlist('value[]'))

def pk_5(**kwargs):
    value = kwargs['value'].split(' ')[0].split('.')
    value = int("".join(value))
    return value

UPDATE_PRECONDITIONS = {
    '1': pk_1,
    '3': pk_3,
    '4': pk_4,
    '5': pk_5
}


CHANGES = dict()

#Refactor this whole thing to use SQLAlchemy 
class ProductManager:
    

    def __init__(self):
        self.NEW_PRODUCTS_PATH = os.getcwd() + self._os_path('static','database', 'new_products')
        self.PRODUCTS_PATH = os.getcwd() + self._os_path('static', 'database', 'products')
        self._update_database(self.NEW_PRODUCTS_PATH, self.PRODUCTS_PATH)

    """
    Query a product by name
    """
    def get_product(self, pID):
        return Product.query.filter_by(pID=pID).first()


    """
    Add a non-commited setting to a product.
    If a current product to be changed does not exist in CHANGES then create key/value pair {pID: dict()}.
    If a current user that is changing the product does not exist in CHANGES then create key/value pair {pID: {uID: dict()}}
    Depending on the attribute there will be corresponding precondition checking pulling from the dictionary.
    """
    def update_setting(self, uID, pID, request, d_flag=False):

        if CHANGES.get(pID) == None:
            CHANGES[pID] = dict()
        if CHANGES.get(pID).get(uID) == None:
            CHANGES[pID][uID] = dict()
        
        uID_c = CHANGES[pID][uID]

        if d_flag:
            des = request.get('value')
            uID_c['pDescription'] = des
            return des

        pk = request.get('pk')
        attr = COL_MAP.get(pk)
        value = request.get('value')
        if type(value) == str: value = value.strip()
        
        pred = UPDATE_PRECONDITIONS.get(pk)
        if pred:
            v = pred(self=self, value=value, request=request, pID=pID)
            if pk == '1':
                if v == 1: return v
                if v == 0: 
                    uID_c.pop(attr)
                    return 
            else:
                value = v

        uID_c[attr] = value

        return 0

    """
    Commit all previous changes
    """
    def commit_settings(self, uID, pID):
        if CHANGES.get(pID) is None or CHANGES.get(pID).get(uID) is None:
            return

        pass


    """
    This method is called once when the server starts up. 
    It will look for new products in a specific folder to add to the database. 
    Moving all the neccessary files of a new product to a server run-time products folder whose new product folder name will be a hashed string of its contents.
    """
    def _update_database(self, new_path, path):
        for name in os.listdir(new_path):
            new_product_path = new_path + self._os_path(name)
            new_product = dict()
            product_path = path + self._os_path(dirhash(new_product_path))
            os.mkdir(product_path)
            for item in os.listdir(new_product_path):
                new_item_path = new_product_path + self._os_path(item)
                if item == 'information.json':
                    with open(new_item_path) as f:
                        data = json.load(f)
                        data['pSize'] = str(data['pSize'])
                        new_product.update(data)
                        new_product['pID'] = self._name_to_id(data['pName'])
                    os.remove(new_item_path)
                else:
                    item_path = product_path + self._os_path(item)
                    shutil.move(new_item_path, item_path)
                    new_product['p{}Path'.format(item[0].upper())] = os.path.relpath(item_path, os.getcwd())
            os.rmdir(new_product_path)
            new_product = Product(**new_product)
            db.session.add(new_product)
            db.session.commit()

    """
    Return a id from name for using as a primary key
    """
    def _name_to_id(self, name):
        return name.lower().replace(' ', '-')

    """
    Concatenate path using appropriate delimiter for different OS
    """
    def _os_path(self,*args):
        if os.name == 'nt':
            return '\\' + '\\'.join(args)
        else:
            return '/' + '/'.join(args)


if __name__ == '__main__':

    ma = ProductManager()
    #print(ma.PRODUCTS)
    #print(ma.get_product('black-hoodie'))


        
