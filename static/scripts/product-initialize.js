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

	//TinyMCE
	tinymce.init({
				selector: '.tinymce-area',
				mode: 'textareas',
				height: 600,
				plugins: [
				'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
				'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
				'table emoticons template paste help'
				],
				language: 'vi',
				toolbar: 'undo redo | styleselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent'
	});

	$('.tinymce-form').submit(function(e) {
		e.preventDefault();
		updateDescriptionSetting('product-description');
	});

	//X-editable & Poshytip
	$.fn.editableform.buttons = "<button type=\"submit\" class=\"editable-submit\"></button><button type=\"button\" class=\"editable-cancel\"></button>"

	//Responsive
	//loadProduct('product-description');


});
