from flask import Blueprint, render_template, request
from flask_login import current_user
from database.model import Product, User
import product_handler as ph
import json

manager = ph.ProductManager()
products_bp = Blueprint('products',__name__)

@products_bp.route('/products')
def products_error():
    return render_template('shop_error.html')

#Update this using SQLAlchemy 
@products_bp.route('/products/')
@products_bp.route('/products/<product_name>',methods=['GET'])
def products_route(product_name=''):

    product_ = Product.query.filter_by(name=product_name).first()

    if product_ is None:
        return render_template('shop_error.html')
    else:
        pass

    product = manager.get_product(product_name)
    if product is not None:
        info = json.loads(product.get('product_specs.json',''))
        des = product.get('description.txt','')
        images = product.get('images')
        PRODUCT_JSON = {'info' : info,'des' : des,'images' : images};
        return render_template('shop_product.html',PRODUCT_NAME=info['title'],PRODUCT_JSON=PRODUCT_JSON)
    else:
        return render_template('shop_error.html')

@products_bp.route('/products/new_product', methods=['GET'])
def new_product():
    if current_user.is_authenticated and current_user.permission == 'admin':
        info = {'title': 'Đặt tên sản phẩm', 'brand' : 'Hãng', 'status' : 'Trạng thái', 'size' : [], 'price' : '200.000VNĐ'}
        des = dict()
        PRODUCT_JSON = {'info' : info, 'des' : des}
        return render_template('shop_product.html', PRODUCT_JSON=PRODUCT_JSON)

    return render_template('shop_error.html')


"""AJAX Functions"""
@products_bp.route('/save_description',methods=['PUT'])
def save_description():
    print(request.form)
    return ''
