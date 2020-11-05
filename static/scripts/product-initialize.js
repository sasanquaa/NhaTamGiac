//Initialization
$(function() {
	//Slick scroll
	setTimeout(function() {
		$('.info-image').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			asNavFor: '.info-images-scroll',
			arrows: false,
			fade: true
		});

		$('.info-images-scroll').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			asNavFor: '.info-image',
			centerMode: true,
			focusOnSelect: true,
			arrows: false,
			variableWidth: true,
			infinite: true
		});

	}, 300);

	$('#add-button').click(function(e) {

		$.ajax({
			url: $(this).attr('url'),
			type: 'get',
			success: function(cart) {
				$('.cart-count').html(Object.values(cart).reduce((a, b) => a + b.qty, 0));
			},
			data: {
				'name': $('#product-title').text(),
				'quantity': $('.quantity-input').val(),
				'price': parseInt($('#product-price').text().slice(0, -4).replaceAll('.', ''))
			}
		});


	});


	var qtyPlus = $('.quantity-plus');
	var qtyMinus = $('.quantity-minus');
	var qtyInput = $('.quantity-input');
	var max = parseInt(qtyInput.attr('max'));
	var min = parseInt(qtyInput.attr('min'));
	
	qtyPlus.click(function(e) {
		var q = parseInt(qtyInput.val());
		if(q + 1 <= 100) qtyInput.val(q + 1); 	
	});


	qtyMinus.click(function(e) {
		var q = parseInt(qtyInput.val());
		if(q - 1 >= 1) qtyInput.val(q - 1);
	});

	qtyInput.keyup(function(e) {
		if(e.key.match(/[+-.,]/g)) {
			console.log(qtyInput.val());
			return;
		}

		var q = parseInt(qtyInput.val())
		if(q > 100) qtyInput.val(100);
		if(q < 1) qtyInput.val(1);
	});
	
});
