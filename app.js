var express = require('express');
var app = express();
var flash = require('connect-flash');
var bodyparser = require('body-parser');
var nunjucks = require('nunjucks');
var env = nunjucks.configure('views', {
	autoescape: true,
	express: app
});
var crypto = require('crypto');
var session = require('express-session');
var db = require('./model/db.js');
var util = require('./control/utilities.js');

var port = process.env.PORT || 8080;

app.use('/static', express.static('static'));
app.use(flash());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(session({
	key: 'app.sid',
	resave: false,
	saveUninitialized: true,
	secret: '@J>:1ob#IFcyC-?4sNEbUFws#3S,M84k4rf!kYB]8UuN/a5"Sg|TdHzz#x|991e',
	cookie: {
		maxAge: 600000
	}
}));

app.set('views', './views');
app.set('view engine', 'html');

env.addGlobal('url_for', util.url_for);

//Views
require('./control/index')(app);
require('./control/product')(app, db.NAMESPACE, util.shuffle);
require('./control/authenticate')(app, db.NAMESPACE, crypto);
require('./control/report')(app, db.NAMESPACE);
require('./control/payment')(app, db.NAMESPACE);
require('./control/error')(app);

app.listen(port, () => {});


