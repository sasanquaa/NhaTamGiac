$(function() {

	//Show more
	//FIX PATH
	var productBox = "<div class='product-row'> <div class='product-box-div'> <div class='product-box'> <div class='product-box-title'> Pink Hoodie <div class='product-box-description'> Some Description </div></div><div class='product-box-image-paddable'> <div class='product-box-image'> <img src='/static/products/product_id1/product_image1'> </div></div><div class='product-box-style'> </div><div class='product-box-container'> <div class='product-box-price'> 150.000 VNĐ </div><div class='product-box-add-to-cart'> <div>Thêm vào giỏ</div></div></div></div></div><div class='product-box-div'> <div class='product-box'> <div class='product-box-title'> Black Hoodie <div class='product-box-description'> Some Description </div></div><div class='product-box-image-paddable'> <div class='product-box-image'> <img src='/static/products/product_id2/product_image2'> </div></div><div class='product-box-style'> </div><div class='product-box-container'> <div class='product-box-price'> 250.000 VNĐ </div><div class='product-box-add-to-cart'> <div>Thêm vào giỏ</div></div></div></div></div><div class='product-box-div'> <div class='product-box'> <div class='product-box-title'> Dark Pink Hoodie <div class='product-box-description'> Some Description </div></div><div class='product-box-image-paddable'> <div class='product-box-image'> <img src='/static/products/product_id3/product_image3'> </div></div><div class='product-box-style'> </div><div class='product-box-container'> <div class='product-box-price'> 350.000 VNĐ </div><div class='product-box-add-to-cart'> <div>Thêm vào giỏ</div></div></div></div></div></div>"
	
	var productSection = $('.product-section');
	var productContainer = $('.product-container');
	var showMore = $('.product-scroll');
	var PER_ROW_HEIGHT = 450;
	
	showMore.click(function() {
		$.getJSON(ROOT + '/get_product',{},function(data) {
			var res;
			productSection.css({'min-height': productSection.height() + PER_ROW_HEIGHT});
			productContainer.css({'min-height': productContainer.height() + PER_ROW_HEIGHT});
			res = productBox.replace("product_id1",data.id1);
			res = res.replace("product_id2",data.id2);
			res = res.replace("product_id3",data.id3);
			res = res.replace("product_image1",data.img1);
			res = res.replace("product_image2",data.img2);
			res = res.replace("product_image3",data.img3);
			productContainer.append(res);
		});
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


