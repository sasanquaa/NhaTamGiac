
module.exports = function(app) {

	app.get('/', index_view);
	function index_view(req, res) {
		var cart = req.session.cart;
		res.render('shop_index', {
			current_user: req.session.user,
			pcount: 3,
			cart_count: cart ? Object.values(cart).reduce((a, b) => a + b.qty, 0) : 0

		}); 
	}

}
