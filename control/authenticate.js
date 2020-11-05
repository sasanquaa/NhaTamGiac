module.exports = function(app, NAMESPACE, crypto) {

    const uuid = require('uuid').v5;
    const User = require('../model/db-models').User;

    app.get('/login', login_view);
    function login_view(req, res) {

        if(req.session.user) res.redirect('/'); 
        else {
            res.render('shop_login', {messages: req.flash('error')});
        }
    }

    app.post('/login', login_authenticate);
    function login_authenticate(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var user = User.find({_id: uuid(email, NAMESPACE)}).cursor();

        user.next().then(u => {
            if(u == null) {
                req.flash('error', 'Tài khoản không tồn tại hoặc sai mật khẩu.');
                res.redirect('/login');
            }
            else {
                var [salt, tkey] = u.password.split(":");
                crypto.scrypt(password, salt, 64,(err, key) => {
                    if(key == tkey) {
                        u.password = tkey;
                        req.session.user = u;
                        res.redirect('/');
                    }else {
                        req.flash('error', 'Tài khoản không tồn tại hoặc sai mật khẩu.');
                        res.redirect('/login');
                    }
                });
            }
        });

    }

    app.get('/logout', logout_view);
    function logout_view(req, res) {
        req.session.user = null;
        res.redirect('/');
    }

    app.get('/signup', signup_view);
    function signup_view(req, res) {
        res.render('shop_signup', {messages: req.flash('error')});
    }

    app.post('/signup', signup_account);
    function signup_account(req, res) {
        var email = req.body.email;
        var name = req.body.name;
        var password = req.body.password;
        var id = uuid(email, NAMESPACE);
        var user = User.find({_id: id}).cursor();

        user.next().then(u => {
            if(u == null) {
                var salt = crypto.randomBytes(16).toString('hex');
                crypto.scrypt(password, salt, 64, (err, key) => {
                    user = new User();
                    user._id = id;
                    user.username = name;
                    user.email = email;
                    user.password =  salt + ":" + key;
                    user.permission =  ['user'];
                    user.save();
                    req.flash('error', 'Tài khoản đã tạo thành công!');
                    res.redirect('/signup');
                });
            }else {
                req.flash('error', 'Tài khoản đã tồn tại.');
                res.redirect('/signup');
            }
        });
    }

}
