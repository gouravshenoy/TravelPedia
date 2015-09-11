$(document).ready(function(){
	$('#GuestbookCommentToggle').on('click', '.d-next', function(){
		$('#GuestbookContainer').slideToggle('slow');
	});
	
	console.log('[guestBookScript.js | document.ready] Getting Guestbook comments as JSON');
	$.getJSON('/guestbook', function(data){
		console.log('[guestBookScript.js | $.getJSON] received json: ' + JSON.stringify(data));
		var html = '';
		
		$.each(data, function(index, value) {
			html += '<li><p>'+value.comments+'</p>' +
					'<a href="#">'+value.name+'</a>' +
					'<span>'+value.location+'</span>' +
					'<label></label>' +
					'</li>';
		});
		
		
		$('.client-grids ul').append(html);
		
		$('.bxslider').bxSlider({
			 auto: true,
			 autoControls: true,
			 minSlides: 4,
			 maxSlides: 4,
			 slideWidth:450,
			 slideMargin: 10
		});
	});
});