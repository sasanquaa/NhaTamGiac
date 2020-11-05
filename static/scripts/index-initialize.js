$(function() {

	function b64DecodeUnicode(str) {
		// Going backwards: from bytestream, to percent-encoding, to original string.
		return decodeURIComponent(atob(str).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
	}

	var p_box = "PGRpdiBjbGFzcz0icHJvZHVjdC1ib3gtZGl2IiA+DQoJPGRpdiBjbGFzcz0icHJvZHVjdC1ib3giPg0KCQk8YSBjbGFzcz0icHJvZHVjdC1saW5rIiBocmVmPSJ7e3BsaW5rfX0iPg0KCQkJPGRpdiBjbGFzcz0icHJvZHVjdC1ib3gtdGl0bGUiPg0KCQkJCXt7bmFtZX19DQoJCQkJPGRpdiBjbGFzcz0icHJvZHVjdC1ib3gtZGVzY3JpcHRpb24iPg0KCQkJCQlTb21lIERlc2NyaXB0aW9uDQoJCQkJPC9kaXY+DQoJCQk8L2Rpdj4NCgkJPC9hPg0KCQkNCgkJPGEgY2xhc3M9InByb2R1Y3QtYm94LWltYWdlLXBhZGRhYmxlIiBocmVmPSJ7e3BsaW5rfX0iPg0KCQkJPGRpdiBjbGFzcz0icHJvZHVjdC1ib3gtaW1hZ2UiPg0KCQkJCTxpbWcgc3JjPSJ7e2ltZ19zcmN9fSI+DQoJCQk8L2Rpdj4NCgkJPC9hPg0KCQk8ZGl2IGNsYXNzPSJwcm9kdWN0LWJveC1zdHlsZSI+DQoJCTwvZGl2Pg0KCQk8ZGl2IGNsYXNzPSJwcm9kdWN0LWJveC1jb250YWluZXIiPg0KCQkJPGRpdiBjbGFzcz0icHJvZHVjdC1ib3gtcHJpY2UiPg0KCQkJCXt7cHJpY2V9fSBWTsSQDQoJCQk8L2Rpdj4NCgkJCTxkaXYgY2xhc3M9InByb2R1Y3QtYm94LWFkZC10by1jYXJ0IiB1cmw9e3tjYXJ0X3VybH19Pg0KCQkJCTxkaXY+VGjDqm0gdsOgbyBnaeG7jzwvZGl2Pg0KCQkJPC9kaXY+DQoJCTwvZGl2Pg0KCTwvZGl2Pg0KPC9kaXY+";
	var p_pending_box = "CTxkaXYgY2xhc3M9J3Byb2R1Y3QtYm94LWRpdic+DQoJCTxkaXYgY2xhc3M9J3BoLWl0ZW0nPg0KCQkJPGRpdiBjbGFzcz0ncGgtY29sLTEyJz4NCg0KCQkJCTxkaXYgY2xhc3M9J3BoLXJvdyc+DQoJCQkJCTxkaXYgY2xhc3M9InBoLWNvbC0xMiBiaWciPjwvZGl2Pg0KCQkJCQk8ZGl2IGNsYXNzPSJwaC1jb2wtOCI+PC9kaXY+DQoJCQkJPC9kaXY+DQoJCQk8ZGl2IGNsYXNzPSdwaC1waWN0dXJlJz48L2Rpdj4NCgkJCTxkaXYgY2xhc3M9J3BoLXJvdyc+DQoJCQkJPGRpdiBjbGFzcz0icGgtY29sLTEyIGJpZyI+PC9kaXY+DQoJCQk8L2Rpdj4NCg0KCQkJPC9kaXY+DQoJCTwvZGl2Pg0KCTwvZGl2Pg==";
	var p_container = $('.product-container');
	var p_init = false;
	var p_exhausted = false;

	$.ajax({
		url: '/product/load/3',
		type: 'get',
		success: function(msg) {
			p_container.children().last().children().last().remove();
			p_container.children().last().children().last().remove();
			p_container.children().last().children().last().remove();
			var p_box_ascii = b64DecodeUnicode(p_box);
			msg.ps.forEach(p => {
				var tmp = p_box_ascii.replace('{{name}}', p.name)
									.replace('{{price}}', parseInt(p.price).toLocaleString().replaceAll(',', '.'))
									.replaceAll('{{plink}}', '/product/' + p.name.toLowerCase().replaceAll(' ', '-'))
									.replace('{{cart_url}}', '/product/add_to_cart/' + p._id)
									.replace('{{img_src}}', '/product/' + p._id + '/img/1');
				p_container.children().last().append(tmp);
			});
			var a = $('#load-form').attr('action').split('/');
			a[3] = msg.pcount;
			$('#load-form').attr('action', a.join('/'));
			p_init = true;
			init_add_to_cart();
		},
		beforeSend: function() {
			var p_pending_ascii = b64DecodeUnicode(p_pending_box);
			p_container.append('<div class=\'product-row\'></div>');
			p_container.children().last().append(p_pending_ascii);
			p_container.children().last().append(p_pending_ascii);
			p_container.children().last().append(p_pending_ascii);

		}
	});

	function init_add_to_cart() {
		$('.product-box-add-to-cart').click(function(e) {
			$.ajax({
				url: $(this).attr('url'),
				type: 'get',
				success: function(cart) {
					console.log(cart);
					$('.cart-count').html(Object.values(cart).reduce((a, b) => a + b.qty, 0));
				},
				data: {length: 0}
			});
		});
	}


	$('#load-form').click(function() {
		if(!p_init) return;
		$.ajax({
			url: $(this).attr('action'),
			type: $(this).attr('method'),
			success: function(msg) {
				p_container.children().last().children().last().remove();
				p_container.children().last().children().last().remove();
				p_container.children().last().children().last().remove();
				var p_box_ascii = b64DecodeUnicode(p_box);
				msg.ps.forEach(p => {
					var tmp = p_box_ascii.replace('{{name}}', p.name)
									.replace('{{price}}', parseInt(p.price).toLocaleString().replaceAll(',', '.'))
									.replaceAll('{{plink}}', '/product/' + p.name.toLowerCase().replaceAll(' ', '-'))
									.replace('{{cart_url}}', '/product/add_to_cart/' + p._id)
									.replace('{{img_src}}', '/product/' + p._id + '/img/1');
					p_container.children().last().append(tmp);
				});
				var a = $('#load-form').attr('action').split('/');
				a[3] = msg.pcount;
				$('#load-form').attr('action', a.join('/'));
				init_add_to_cart();
				p_exhausted = msg.exhausted;
			},
			
			beforeSend: function() {
				if(p_exhausted) return;
				var p_pending_ascii = b64DecodeUnicode(p_pending_box);
				p_container.append('<div class=\'product-row\'></div>');
				p_container.children().last().append(p_pending_ascii);
				p_container.children().last().append(p_pending_ascii);
				p_container.children().last().append(p_pending_ascii);

			}
		})
	});

	//Banner Scrolling
	var images = {
		1: '1.jpg',
		2: '2.jpg',
		3: '3.jpg',
		4: '4.jpg',
		5: '5.jpg',
		6: '6.jpg'
	}

	var scrolls = {
		1: $('#scroll-1'),
		2: $('#scroll-2'),	
		3: $('#scroll-3'),
		4: $('#scroll-4'),
		5: $('#scroll-5'),
		6: $('#scroll-6')
	}
	
	var flip = true;
	var background = $('#background-changer');
	var backgroundFlip = $('#background-changer-flip');

	var currentIndex = 1;
	var previousIndex = 1;
	var maxImages = 6;

	var prefix = '/static/posters/';
	background.css({'background-image': 'url(\'' + prefix + images[currentIndex] + '\')','opacity': '1'});
	scrolls[currentIndex].css({'background': '#f2e7da'});

	var arrowLeft = $('#arrow-left');
	var arrowRight = $('#arrow-right');

	var lock = false;
	var autoScrolling;

	function scrolling(index) {
		window.clearTimeout(autoScrolling);
		lock = true;
		image = prefix + images[index];
		scroll = scrolls[index];
		scrolls[previousIndex].css({'background' : '#20214d'});
		scroll.css({'background' : '#f2e7da'});
		if(flip) {
			background.css({'opacity' : 0});
			backgroundFlip.css({'background-image': 'url(\'' + image + '\')','opacity': '1'});
		}
		else {
			backgroundFlip.css({'opacity' : 0});
			background.css({'background-image': 'url(\''+ image + '\')','opacity': '1'});
		}
		flip = !flip;
		previousIndex = currentIndex;
		window.setTimeout(function(){
			lock = false;
			autoScrollingFunc();
		},800);
	}

	function autoScrollingFunc() {
		var delay = Math.round(3000 + (8000 - 3000) * Math.random());
		autoScrolling = window.setTimeout(function() {
			if(autoScrolling) {
				currentIndex += 1
				if(currentIndex == 7) {
					currentIndex = 1;
					previousIndex = maxImages;
				}
				scrolling(currentIndex);			
			}
		},delay);
	}

	arrowLeft.click(function() {
		if(!lock) {
			currentIndex -= 1
			if(currentIndex == 0) {
				currentIndex = maxImages;
				previousIndex = 1;

			}
			scrolling(currentIndex);
		}
				
	});

	arrowRight.click(function() {
		if(!lock) {
			currentIndex += 1
			if(currentIndex == 7) {
				currentIndex = 1;
				previousIndex = maxImages;
			}
			scrolling(currentIndex);
		}
	});  

	autoScrollingFunc();

});


