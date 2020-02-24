from flask import Blueprint, render_template, request
from flask_login import login_required, current_user

main_bp = Blueprint('main',__name__)

@main_bp.route('/')
def index():
    return render_template('shop_index.html')


