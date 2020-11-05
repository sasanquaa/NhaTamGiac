
module.exports = function(app, NAMESPACE) {

	const uuid = require('uuid').v5;
	const UserReport = require('../model/db-models').UserReport;

	app.get('/report', report_view);
	function report_view(req, res) {
		var cart = req.session.cart;
		res.render('shop_report', {
			current_user: req.session.user,
			messages: req.flash('report'),
			cart_count: cart ? Object.values(cart).reduce((a, b) => a + b.qty, 0) : 0
		});
	}
	
	app.post('/report/submit', report_submit);
	function report_submit(req, res) {
		var id = uuid(req.body.email, NAMESPACE);
		var report = {
			_id: 0,
			title: req.body.title,
			orderid: req.body.orderid,
			contents: req.body.contents,
			date: Date.now()
		}

		UserReport.find({_id: id})
		.cursor()
		.next()
		.then(function(usr) {
			if(usr == null) {
				usr = new UserReport();
				usr._id = id;
				usr.reports = [report];
			}else {
				report._id = usr.reports.length;
				usr.reports.push(report);
			}
			usr.save();
			req.flash('report', 'Đã gửi báo cáo thành công.');
			res.redirect('/report');
		});
	}

}