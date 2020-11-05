function postAjaxJSON(url,data,success=function(res){},error=function(res){}) {
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
function updateDescriptionSetting(name) {
	var button = $('.description-edit-button'); 
	var form = tinyMCE.get(name);
	var formParent = $('.tinymce-form');
	form.setProgressState(1);
	postAjaxJSON('/update_setting',
		{
			'pk': 6,
			'value' : form.getContent()
		},
		function(res) {
			form.setProgressState(0);
			formParent.css({
				'display': 'none'
			});
			button.css({
				'display': 'block'
			});
			var div = $('.description-div');
			div.css({
				'display': 'block'
			});
			div.html(res.pDescription);
		}
	);

}

function editButton() {
	var div = $('.description-div');
	var button = $('.description-edit-button'); 
	var formParent = $('.tinymce-form');
	formParent.css({
		'display': 'block'
	});
	button.css({
		'display': 'none'
	});
	div.css({
		'display': 'none'
	});
}

