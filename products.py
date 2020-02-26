from flask import Blueprint, render_template, request
from flask_login import current_user
import products_wrapper as pw
import json

manager = pw.ProductManager()
products_bp = Blueprint('products',__name__)
new_product = {'pName': 'Đặt tên sản phẩm', 'pBrand' : 'Hãng', 'pStatus' : 'Trạng thái', 'pSize' : [], 'pPrice' : '200.000 VNĐ'}

@products_bp.route('/products')
def products_error():
    return render_template('shop_error.html')

@products_bp.route('/products/')
@products_bp.route('/products/<product_id>',methods=['GET'])
def products_route(product_id=''):
    print(product_id)
    product = manager.get_product(product_id)
    if product is None:
        return render_template('shop_error.html')
    else:
        product = product.as_dict()
        return render_template('shop_product.html', product=product)

@products_bp.route('/products/new_product', methods=['GET'])
def new_product():
    if current_user.is_authenticated and current_user.uPermission == 'admin':
        return render_template('shop_product.html', product=new_product)
    return render_template('shop_error.html')


"""
Prototyping product attributes updating functions
Currently not good at synchronization
"""

"""AJAX Functions"""
@products_bp.route('/update_setting', methods=['PUT', 'POST'])
def update_setting():
    if current_user.is_authenticated and current_user.uPermission == 'admin':
        uID = current_user.uID
        pID = request.args.get('pID')
        if request.get_json() is not None:
            des = manager.update_setting(uID, pID, request.get_json(), True)
            return json.dumps({'pDescription': des}), 202, {'ContentType': 'application/json'}         
        v = manager.update_setting(uID, pID, request.form)
        if v == 1:
            return json.dumps({'error_value': request.form.get('value')}), 403, {'ContentType' : 'application/json'}
        return {}, 202, {}
    return render_template('shop_error.html')

@products_bp.route('/commit_settings', methods=['POST'])
def commit_settings():
    return ''
