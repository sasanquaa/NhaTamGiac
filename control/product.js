module.exports = function(app, NAMESPACE, shuffle) {

	const uuid = require('uuid').v5;
	const Product = require('../model/db-models').Product;

	let pcol;
	let pidx;

	app.get('/product/:product_id', product_view);
	function product_view(req, res) {
		var cart = req.session.cart;
		var pid = uuid(req.params.product_id, NAMESPACE);
		if(pid == 'close') db.close();

		var product = Product.find({_id: pid}).cursor();

		product.next().then(p => {
			if(p == null) res.redirect('/error');
			res.render('shop_product', {
				product: p, 
				product_id: pid, 
				current_user: req.session.user,
				cart_count: cart ? Object.values(cart).reduce((a, b) => a + b.qty, 0) : 0
			});
		});
	}


	app.get('/product/:product_id/img/:id', product_view_img);
	function product_view_img(req, res) {
		var pid = req.params.product_id;
		var id = req.params.id;

		Product
		.find({_id: pid})
		.cursor()
		.next().then(p => {
			res.set('Content-Type', 'image/png');
			res.end(p.images[id - 1], 'binary');
		});

	}

	app.get('/product/load/:pcount', product_load);
	function product_load(req, res) {

		var pcount = req.params.pcount;
		var ps = new Array();
		var i, n = parseInt(pcount) + 3;

		if(!pcol || pcount == 3) {
			pcol = new Array();
			Product.find().exec((err, a) => {
				pcol.push.apply(pcol, a);
				shuffle(pcol);
				i = 0;
				while(i < pcount && i < pcol.length) ps.push(pcol[i++]);
				pidx = i;
				res.send({'ps': ps, 'pcount' : n, 'exhausted': false});
			});
			return;
		}

		i = pidx;
		n = Math.min(n, pcol.length);
		while(i < pcount && i < pcol.length) ps.push(pcol[i++]);
		if(ps.length != 0) {
			pidx = i;
			res.send({'ps': ps, 'pcount' : n, 'exhausted': pcount == pcol.length});
		}

	}

	app.get('/product/add_to_cart/:product_id', product_add_to_cart);
	function product_add_to_cart(req, res) {
		var pid = req.params.product_id;
		var name = req.query.name;
		var qty = req.query.quantity;
		var price = req.query.price;

		if(!req.session.cart) req.session.cart = {};

		if(req.query.length == 0) {
			
			Product.find({_id: pid})
			.cursor()
			.next().then(p => {
				name = p.name;
				qty = 1;
				price = p.price;

				req.session.cart[pid] = {
					'name': name,
					'qty' : parseInt(qty),
					'price': price
				};
				res.send(req.session.cart);
			});
		}else {
			req.session.cart[pid] = {
				'name': name,
				'qty' : parseInt(qty),
				'price': price
			};
			res.send(req.session.cart);
		}

	}


}
