function sendAjaxJSON(url,data,success=function(res){},error=function(res){}) {
	$.ajax({
		url: ROOT + url,
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		dataType: 'json',
		success: success,
		error: error
	});
}

function getAjaxJSON(url,success=function(res){},error=function(res){}) {
	$.ajax({
		url: ROOT + url,
		type: 'GET',
		dataType: 'json',
		success: success,
		error: error
	});
}

/*
 * @param {type} name For tinyMCE
*/
function saveProduct(name) {
	var product = PRODUCT_JSON;
	var form = tinyMCE.get(name);
	var formParent = $('.tinymce-form');
	form.setProgressState(1);
	sendAjaxJSON('/save_description',
		{'content' : form.getContent()},
		function(res) {
			form.setProgressState(0);
			form.remove();
			formParent.children().get(0).remove();
			formParent.children().get(0).remove();
			formParent.children().get(0).remove();
			var div = $(formParent.children().get(0));
			div.css({
				'display': 'block'
			});
			div.html(res.content);
		},
		function(result) {
		
		}
	);

}

/*
 * @param {type} name For tinyMCE
*/
function loadProduct(name) {
	var product = PRODUCT_JSON;
	var title = $($('.title').children().get(0));
	var brand = $($($('.brand').children().get(0)).children().get(0));
	var status = $($($('.status').children().get(0)).children().get(0));
	var size = $($($('.size').children().get(0)).children().get(0));
	var price = $($('.price').children().get(1));
	var form = tinyMCE.get(name);
	var formParent = $('.tinymce-form');
	
	var productInfo = product.info;
	var productImages = product.images;
	var productDescription = product.des;

	title.html(productInfo.title);
	brand.html(productInfo.brand);
	status.html(productInfo.status);
	price.html(productInfo.price);

	for(i = 0; i < productInfo.size.length; i++) {
		size.append('<li>' + productInfo.size[i] +'</li>');
	}

	if(product.des == '') return;
	form.remove();
	formParent.children().get(0).remove();
	formParent.children().get(0).remove();
	formParent.children().get(0).remove();
	var div = $(formParent.children().get(0));
	div.css({
		'display': 'block'
	});
	div.html(productDescription);
}

