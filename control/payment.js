module.exports = function(app, NAMESPACE) {
	
	const uuid = require('uuid').v5;
	const Payment = require('../model/db-models').Payment;

	app.get('/payment', payment_view);
	function payment_view(req, res) {
		var cart = req.session.cart;
		var total = 0;

		for(id in cart) {
			total += cart[id].price * cart[id].qty;
		}

		res.render('shop_payment', {
			current_user: req.session.user,
			messages: req.flash('payment'),
			total: total,
			cart: cart,
			cart_count: cart ? Object.values(cart).reduce((a, b) => a + b.qty, 0) : 0
		});
	}
	
	app.post('/payment/submit', payment_submit);
	function payment_submit(req, res) {
		var id = uuid(req.body.email, NAMESPACE);
		var cart = req.session.cart;
		var total = 0;
		for(id_ in cart) {
			total += cart[id_].price * cart[id_].qty;
		}

		var payment = {
			_id: 0,
			username : req.body.username,
			phone : req.body.phone,
			address : req.body.address,
			dtype : parseInt(req.body.dtype),
			ptype : parseInt(req.body.ptype),
			total: total,
			date : Date.now()
		}

		Payment.find({_id: id})
		.cursor()
		.next()
		.then(function(p) {
			if(p == null) {
				var p = new Payment();
				p._id = uuid(req.body.email, NAMESPACE);
				p.payments = [payment];
			}else {
				payment._id = p.payments.length;
				p.payments.push(payment);
			}
			p.save();
			req.session.cart = {};
			req.flash('payment', 'Đặt hàng thành công!');
			res.redirect('/payment');
		});


	}
    
}