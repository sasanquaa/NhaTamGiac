module.exports = function(app) {

	app.get('*', error_view);
	function error_view(req, res) {
		var cart = req.session.cart;
		res.render('shop_error',
		{
			current_user: req.session.user,
			cart_count: cart ? Object.values(cart).reduce((a, b) => a + b.qty, 0) : 0
		});
	}

}