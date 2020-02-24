import os
import random
from database.model import db, Product

class ProductManager:

    def __init__(self):
        self.PATH = os.getcwd() + self._os_path('static','products')
        self.PRODUCTS = dict()
        self._TEXT_READ = set(['description.txt','product_specs.json'])
        self._get_products(self.PATH,self.PRODUCTS)

    def get_product(self,name):
        return self.PRODUCTS.get(name)

    def _get_products(self,path,res):
        for name in os.listdir(path):
            dir_path = path + self._os_path(name)
            if os.path.isdir(dir_path):
                new_dict = dict()
                res[name] = new_dict
                if name != 'images':
                    new_dict['path'] = dir_path
                self._get_products(dir_path,new_dict)
            else:
                if name in self._TEXT_READ:
                    text = ""
                    with open(dir_path,'r') as fh:
                        for line in fh:
                            text += line
                        res[name] = text
                else:
                    res[name] = dir_path

    def _os_path(self,*args):
        if os.name == 'nt':
            return '\\' + '\\'.join(args)
        else:
            return '/' + '/'.join(args)


if __name__ == '__main__':

    ma = ProductManager()
    print(ma.PRODUCTS)
    print(ma.get_product('Test'))


        
