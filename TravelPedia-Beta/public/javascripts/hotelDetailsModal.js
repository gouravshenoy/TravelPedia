var geocoder = new google.maps.Geocoder();
var map;
var service;
var locationId;
/*	
	$('#details').on('click', function(){
		console.log('showing modal');
		
		if($('#carousel-details').find('.carousel-inner').contents().length == 0) {
			var detailsRequest = {	placeId: locationId };
			service.getDetails(detailsRequest, hotelDetailsCallback);
		}
		
		$('#placeDetailsModal').modal('show');
	});
*/	
function detailsInitialize(){
	var mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(-33.8688, 151.2195),
	}
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	service = new google.maps.places.PlacesService(map);
}

function getDetails(locationId) {
	if($('#carousel-details').find('.carousel-inner').contents().length == 0) {
		var detailsRequest = {	placeId: locationId };
		service.getDetails(detailsRequest, hotelDetailsCallback);
		$('#placeDetailsModal').modal('show');
	}
}

function hotelDetailsCallback(result, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		$('#loading').hide();
		buildModal(result);
	}
}

function buildModal(result){
	$('#myModalLabel').append('<img src="'+result.icon+'" width=50 height=50 style="padding-right:10px">' + result.name);
	
	buildHotelDetailsPanel(result);
	
	if(result.photos) {
		buildCarousel(result.photos);
	}
	
	if(result.reviews) {
		buildReviewPanel(result.reviews);
	}
}

function buildCarousel(photos){
	var html = '';
	for(var i=0; i<photos.length; i++) {
		var url = photos[i].getUrl({'maxWidth': 1200, 'maxHeight': 300});
		if(i===0) {
			html += '<div class="item active">'+
						'<img class="slide-image" src="'+url+'">' +
					'</div>';
		} else {
			html += '<div class="item">'+
						'<img class="slide-image" src="'+url+'">' +
					'</div>';
		}
	}
	
	$('#carousel-details').find('.carousel-inner').append(html);
	$('#carousel-details').show();
}

function buildReviewPanel(reviews) {
	var html = '';
	
	$.each(reviews, function(index, review) {
		var rating = review.rating;
		var ratingSpan = '';
		var aspectSpan = '(';
		
		if(rating) {
			var ratingValue = parseInt(rating);
			for(var i=0; i<ratingValue; i++) {
				ratingSpan += '<span class="glyphicon glyphicon-star"></span>';
			}
			
			for(var i=0; i<(5-ratingValue); i++){
				ratingSpan += '<span class="glyphicon glyphicon-star-empty"></span>';
			}
		}
		else {
			for(var i=0; i<5; i++) {
				ratingSpan += '<span class="glyphicon glyphicon-star-empty"></span>';
			}
		}
		
		if(review.aspects) { 
			$.each(review.aspects, function(index, aspect){
				aspectSpan += aspect.type.toUpperCase() + ':' + aspect.rating + ' ';
			});
			
			aspectSpan += ')';
		}
		
		html += '<div class="row" style="padding-left:20px; padding-right:20px">' +
					'<h4>' + review.author_name + '</h4>' +
					'<p class="text-left">' + (new Date(1000*review.time)).toLocaleString() + '</p>' +
					'<div class="ratings">' +
						'<p class="pull-right">' + aspectSpan + '</p>' +
						'<p class="pull-left">' + ratingSpan + '</p>' +
					'</div>' +
					'<br>' +
					'<h5>' + review.text + '</h5>' +
				'</div>' +
				'<hr>';
	});
	
	$('#reviews-panel').append(html);
}

function buildHotelDetailsPanel(result) {
	var html = 	'<div class="row" style="padding-left:20px; padding-right:20px">' +
					'<h5>Address :: ' + result.formatted_address + '</h5>' +
					'<h5>Local Telephone :: ' + result.formatted_phone_number + '</h5>';
					
	if(result.international_phone_number) {
		html += '<h5>International Telephone :: ' + result.international_phone_number + '</h5>';
	}
	
	if(result.website) {
		html += '<h5>Hotel Website :: <a href="' + result.website + '">' + result.website + '</h5>';
	}
	
	html += '</div>';
	
	$('#detailsPanel').append(html);
}

detailsInitialize();
