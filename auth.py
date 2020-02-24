from flask import Blueprint, render_template,url_for, redirect, request, flash
from flask_login import login_required, login_user, logout_user, current_user
from database.model import User, db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/login')
def login():
    if current_user.is_authenticated:
        user = current_user
        print(" - ".join([str(user.id), user.name, user.email, user.password, user.permission]))
        return redirect(url_for('main.index'))
    return render_template('shop_login.html')

@auth_bp.route('/login',methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()

    if user is not None:
        if not check_password_hash(user.password, password):
            flash('Thông tin sai hoặc tài khoản không tồn tại')
            return redirect(url_for('auth.login'))
        else:
            login_user(user)
            return redirect(url_for('main.index'))
    else:
        flash('Thông tin sai hoặc tài khoản không tồn tại')
        return redirect(url_for('auth.login'))

@auth_bp.route('/signup')
def signup():
    return render_template('shop_signup.html')

@auth_bp.route('/signup',methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')
    permission = 'user'
    
    for user in User.query.filter().all():
        print(" - ".join([str(user.id), user.name, user.email, user.password, user.permission]))
    user = User.query.filter_by(email=email).first()

    if user:
        flash('Email đã có người sử dụng')
        return redirect(url_for('auth.login'))

    new_user = User(email=email, name=name, password=generate_password_hash(password, salt_length=16), permission=permission)

    db.session.add(new_user)
    db.session.commit()

    return redirect(url_for('auth.login'))

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))
