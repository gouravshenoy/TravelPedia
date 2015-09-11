$(function(){ // document ready
	
	var activeLocation = locationsArray[0];
	var geocoder = new google.maps.Geocoder();
	var map, map2, map3;
	var service, service2, service3;
	var placeDetailsId;
	
	//////////////////////////////////////////////////
	//	HOTELS HANDLERS
	/////////////////////////////////////////////////
	function mapInitialize(locationName) {
	  $('#budgetRangeSlider_' + activeLocation).slider();
	  getLatLong(locationName + ', IN', function(latLong){
		  var mapOptions = {
		    zoom: 10,
		    center: latLong
		  }
		  
		  map = new google.maps.Map(document.getElementById('lodging-map_'+locationName), mapOptions);
		  infowindow = new google.maps.InfoWindow();
		  service = new google.maps.places.PlacesService(map);
		  
		  var request = {
			location: latLong,
			radius: '50000',
			types: ['lodging'],
			rankBy: google.maps.places.RankBy.PROMINENCE
		  };
		  
		  service.nearbySearch(request, hotelSearchCallback);

	  });
	}
	
	function hotelSearchCallback(results, status, pagination) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			var resultCount = results.length;
			
			for(var i=0; i<(resultCount/2); i++) {
				createMarker(results[i]);
				var detailsRequest = {
					placeId: results[i].place_id
				};
				service.getDetails(detailsRequest, hotelDetailsCallback);
			}
			
			setTimeout(function(){
				for(var i=(resultCount/2); i<20; i++){
					createMarker(results[i]);
					var detailsRequest = {
						placeId: results[i].place_id
					};
					service.getDetails(detailsRequest, hotelDetailsCallback);
				}
			}, 5000);
				
			if(pagination.hasNextPage) {
				var listener = google.maps.event.addDomListenerOnce(map, 'click', function() {
					pagination.nextPage();
				});
			}
			else {
				google.maps.event.clearListeners(map, 'click');
			}
		}
	}
	
	function hotelDetailsCallback(result, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			buildHotelCarousel(result);
		}
		else {
			console.log('no details found for accomodation hotel');
		}
		
	}
	
	function createMarker(place) {
		  var placeLoc = place.geometry.location;
		  var marker = new google.maps.Marker({
		    map: map,
		    position: place.geometry.location
		  });
		  
		  google.maps.event.addListener(marker, 'click', function() {
		    infowindow.setContent(place.name);
		    infowindow.open(map, this);
		  });
	}
	
	function createMarker2(place) {
		  var placeLoc = place.geometry.location;
		  var marker = new google.maps.Marker({
		    map: map2,
		    position: place.geometry.location
		  });
		  
		  google.maps.event.addListener(marker, 'click', function() {
		    infowindow.setContent(place.name);
		    infowindow.open(map2, this);
		  });
	}
	
	function createMarker3(place) {
		  var placeLoc = place.geometry.location;
		  var marker = new google.maps.Marker({
		    map: map3,
		    position: place.geometry.location
		  });
		  
		  google.maps.event.addListener(marker, 'click', function() {
		    infowindow.setContent(place.name);
		    infowindow.open(map3, this);
		  });
	}
	
	function getLatLong(locationName, callback){
		geocoder.geocode( {'address': locationName}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		    	callback(results[0].geometry.location);
		      
		    } else {
		    	console.log('[TRIPBUILDERSCRIPT.js | getLatLong] Failed to get geometry of location: ' + locationName);
		    }
		});
	}
	
	var count=1;
	var hotelId=1;
	var isAccomodationActive = true;
	function buildHotelCarousel(hotelData) {
		var html = '';
		var maxPrice = 8000;
		var minPrice = 500;
		
		if(count == 1 && isAccomodationActive) {
			html += '<div class="item active">' +
						'<div class="row" id="hotel_' + activeLocation + (hotelId) + '">' +
						'</div>' +
					'</div>';
			isAccomodationActive = false;
		}
		else if(count == 1) {
			html += '<div class="item">' +
						'<div class="row" id="hotel_' + activeLocation  + (hotelId) + '">' +
						'</div>' +
					'</div>';
		}
		
		$('#hotelCarousel_' + activeLocation).find('.carousel-inner').append(html);
		$('#loadingPanelACCM_'+activeLocation).hide();
		
		var hotelRatings = hotelData.rating;
		var ratingSpan = '';
		var hotelCost = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
		var hotelRatingValue = 0;
		
		if(hotelRatings) {
			var hotelRatingValue = parseInt(hotelRatings);
			for(var i=0; i<hotelRatingValue; i++) {
				ratingSpan += '<span class="glyphicon glyphicon-star"></span>';
			}
			
			for(var i=0; i<(5-hotelRatingValue); i++){
				ratingSpan += '<span class="glyphicon glyphicon-star-empty"></span>';
			}
		}
		else {
			for(var i=0; i<5; i++) {
				ratingSpan += '<span class="glyphicon glyphicon-star-empty"></span>';
			}
		}
		
		html = '';
		html += '<div class="col-sm-3 col-lg-3 col-md-3" data-cost="'+ hotelCost +'" data-rating="'+ hotelRatingValue +'">' +
					'<div class="thumbnail">' +
						'<img src="'+hotelData.icon+'" alt="hotel">' +
						'<div class="caption">' +
							'<h4>' + hotelData.name + '</h4>' +
							'<p>' + hotelData.formatted_address + '</p>' +
						'</div>' +
						'<div class="ratings">' +
							'<p class="pull-right"><a href="#" class="accomodationDetails" data-placeid="'+hotelData.place_id+'">Details</a></p>' +
							'<p>' + ratingSpan	+ '</p>' +
						'</div>' +
						'<br><b> Rs.' + hotelCost + ' /- per night.</b>' +
						'<hr>' +
						'Add this to my TRIP ' + '<input type="checkbox" name="' + activeLocation + '_accomodations" value="' + (hotelData.name + '__' + hotelCost) + '">' +
					'</div>' +
				'</div>';
		
		$('#hotel_'+ activeLocation+hotelId).append(html);
		$('#hotelCarousel_'+activeLocation).find('.carousel-control').show();
		
		////////////////////////////////////////////////////
		// On click of the 'details' link, show the modal
		///////////////////////////////////////////////////
		$('#hotel_'+ activeLocation+hotelId).find('.accomodationDetails').on('click', function(){
			var placeId = $(this).data("placeid");
			console.log('link clicked for placeId --> ' + placeId + ', placeDetailsId --> ' + placeDetailsId);
			if(placeId == placeDetailsId) {
				//multiple calls made simultaneously for same place
				console.log('multiple calls made simultaneously for same place. Returning!');
				return;
			}
			else {
				getDetails(placeId);
				placeDetailsId = placeId;
			}
		});
		///////////////////////////////////////////////////
		
		count++;
		if(count == 5) {
			count = 1;
			hotelId++;
		}
	}
	
	//////////////////////////////////////////////////
	//	RESTAURANTS HANDLERS
	/////////////////////////////////////////////////
	function initRestaurants(locationName) {
		getLatLong(locationName + ', IN', function(latLong){
			var mapOptions = {
				zoom: 10,
				center: latLong
			}
			
			map2 = new google.maps.Map(document.getElementById('restaurant-map_'+locationName), mapOptions);
			service2 = new google.maps.places.PlacesService(map2);
			  
			var request = {
				location: latLong,
				radius: '50000',
				types: ['restaurant', 'food', 'meal_takeaway', 'meal_delivery'],
				rankBy: google.maps.places.RankBy.PROMINENCE
			};
			  
			  service2.nearbySearch(request, restaurantSearchCallback);

		});
	}
	
	function restaurantSearchCallback(results, status, pagination) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			var resultCount = results.length;
			
			for(var i=0; i<(resultCount/2); i++) {
				createMarker(results[i]);
				var detailsRequest = {
					placeId: results[i].place_id
				};
				service2.getDetails(detailsRequest, hotelDetailsCallback);
			}
			
			setTimeout(function(){
				for(var i=(resultCount/2); i<20; i++){
					createMarker2(results[i]);
					var detailsRequest = {
						placeId: results[i].place_id
					};
					service2.getDetails(detailsRequest, restaurantDetailsCallback);
				}
			}, 5000);
				
			if(pagination.hasNextPage) {
				var listener = google.maps.event.addDomListenerOnce(map2, 'click', function() {
					pagination.nextPage();
				});
			}
			else {
				google.maps.event.clearListeners(map2, 'click');
			}
		}
	}
	
	function restaurantDetailsCallback(result, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			buildRestaurantCarousel(result);
		}
	}
	
	var restCount=1;
	var restID=1;
	var isRestActive = true;
	function buildRestaurantCarousel(hotelData) {
		var html = '';
		if(restCount == 1 && isRestActive) {
			html += '<div class="item active">' +
						'<div class="row" id="rest_'+ activeLocation + (restID) + '">' +
						'</div>' +
					'</div>';
			isRestActive = false;
		}
		else if(restCount == 1) {
			html += '<div class="item">' +
						'<div class="row" id="rest_'+ activeLocation + (restID) + '">' +
						'</div>' +
					'</div>';
		}
		
		$('#loadingPanelREST_'+activeLocation).hide();
		$('#restaurantCarousel_'+activeLocation).find('.carousel-inner').append(html);
		var hotelRatings = hotelData.rating;
		var ratingSpan = '';
		
		if(hotelRatings) {
			var ratingValue = parseInt(hotelRatings);
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
		
		html = '';
		html += '<div class="col-sm-3 col-lg-3 col-md-3">' +
					'<div class="thumbnail">' +
						'<img src="'+hotelData.icon+'" alt="restaurant">' +
						'<div class="caption">' +
							'<h4>' + hotelData.name + '</h4>' +
							'<p>' + hotelData.formatted_address + '</p>' +
						'</div>' +
						'<div class="ratings">' +
							'<p class="pull-right"><a href="#" class="restaurantDetails"  data-placeid="'+hotelData.place_id+'">Details</a></p>' +
							'<p>' + ratingSpan	+ '</p>' +
						'</div>' +
						'<br>' +
						'Add this to my TRIP ' + '<input type="checkbox" name="' + activeLocation + '_restaurants" value="' + hotelData.name + '">' +
					'</div>' +
				'</div>';
		
		$('#rest_'+ activeLocation + restID).append(html);
		$('#restaurantCarousel_'+activeLocation).find('.carousel-control').show();
		
		////////////////////////////////////////////////////
		// On click of the 'details' link, show the modal
		///////////////////////////////////////////////////
		$('#rest_'+ activeLocation + restID).find('.restaurantDetails').on('click', function(){
			var placeId = $(this).data("placeid");
			console.log('link clicked for placeId --> ' + placeId + ', placeDetailsId --> ' + placeDetailsId);
			if(placeId == placeDetailsId) {
				//multiple calls made simultaneously for same place
				console.log('multiple calls made simultaneously for same place. Returning!');
				return;
			}
			else {
				getDetails(placeId);
				placeDetailsId = placeId;
			}
		});
		///////////////////////////////////////////////////
		
		restCount++;
		if(restCount == 5) {
			restCount = 1;
			restID++;
		}
	}
	
	//////////////////////////////////////////////////
	//	PLACES TO VISIT HANDLERS
	/////////////////////////////////////////////////
	function initPlacesToVisit(locationName) {
		getLatLong(locationName + ', IN', function(latLong){
			var mapOptions = {
				zoom: 10,
				center: latLong
			}
			
			map3 = new google.maps.Map(document.getElementById('placesToVisit-map_'+activeLocation), mapOptions);
			service3 = new google.maps.places.PlacesService(map3);
			  
			var request = {
				location: latLong,
				radius: '50000',
				types: ['amusement_park','art_gallery', 'casino', 'church', 'hindu_temple', 'movie_theater', 'shopping_mall', 'park', 'night_club', 'museum'],
				rankBy: google.maps.places.RankBy.PROMINENCE
			};
			  
			  service3.nearbySearch(request, PTVSearchCallback);

		});
	}
	
	function PTVSearchCallback(results, status, pagination) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			var resultCount = results.length;
			
			for(var i=0; i<(resultCount/2); i++) {
				createMarker3(results[i]);
				var detailsRequest = {
					placeId: results[i].place_id
				};
				service3.getDetails(detailsRequest, hotelDetailsCallback);
			}
			
			setTimeout(function(){
				for(var i=(resultCount/2); i<20; i++){
					createMarker3(results[i]);
					var detailsRequest = {
						placeId: results[i].place_id
					};
					service3.getDetails(detailsRequest, PTVDetailsCallback);
				}
			}, 5000);
				
			if(pagination.hasNextPage) {
				var listener = google.maps.event.addDomListenerOnce(map3, 'click', function() {
					pagination.nextPage();
				});
			}
			else {
				google.maps.event.clearListeners(map3, 'click');
			}
		}
	}
	
	function PTVDetailsCallback(result, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			buildPTVCarousel(result);
		}
	}
	
	var ptvCount=1;
	var ptvID=1;
	var isPTVActive = true;
	function buildPTVCarousel(ptvData) {
		var html = '';
		if(ptvCount == 1 && isPTVActive) {
			html += '<div class="item active">' +
						'<div class="row" id="ptv_'+ activeLocation + (ptvID) + '">' +
						'</div>' +
					'</div>';
			isPTVActive = false;
		}
		else if(ptvCount == 1) {
			html += '<div class="item">' +
						'<div class="row" id="ptv_' + activeLocation + (ptvID) + '">' +
						'</div>' +
					'</div>';
		}
		
		$('#loadingPanelPTV_'+activeLocation).hide();
		$('#placesToVisitCarousel_'+activeLocation).find('.carousel-inner').append(html);
		var ptvRatings = ptvData.rating;
		var ratingSpan = '';
		
		if(ptvRatings) {
			var ratingValue = parseInt(ptvRatings);
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
		
		html = '';
		html += '<div class="col-sm-3 col-lg-3 col-md-3">' +
					'<div class="thumbnail">' +
						'<img src="'+ptvData.icon+'" alt="restaurant">' +
						'<div class="caption">' +
							'<h4>' + ptvData.name + '</h4>' +
							'<p>' + ptvData.formatted_address + '</p>' +
						'</div>' +
						'<div class="ratings">' +
							'<p class="pull-right"><a href="#" class="ptvDetails"  data-placeid="'+ptvData.place_id+'">Details</a></p>' +
							'<p>' + ratingSpan	+ '</p>' +
						'</div>' +
						'<br>' +
						'Add this to my TRIP ' + '<input type="checkbox" name="' + activeLocation + '_ptv" value="' + ptvData.name + '">' +
					'</div>' +
				'</div>';
		
		$('#ptv_'+activeLocation+ptvID).append(html);
		
		$('#placesToVisitCarousel_'+activeLocation).find('.carousel-control').show();
		
		////////////////////////////////////////////////////
		// On click of the 'details' link, show the modal
		///////////////////////////////////////////////////
		$('#ptv_'+activeLocation+ptvID).find('.ptvDetails').on('click', function(){
			var placeId = $(this).data("placeid");
			console.log('link clicked for placeId --> ' + placeId + ', placeDetailsId --> ' + placeDetailsId);
			if(placeId == placeDetailsId) {
				//multiple calls made simultaneously for same place
				console.log('multiple calls made simultaneously for same place. Returning!');
				return;
			}
			else {
				getDetails(placeId);
				placeDetailsId = placeId;
			}
		});
		///////////////////////////////////////////////////
		
		ptvCount++;
		if(ptvCount == 5) {
			ptvCount = 1;
			ptvID++;
		}
	}
	
	//////////////////////////////////////////////////
	//	CLIMATE PREVIEW HANDLERS
	/////////////////////////////////////////////////
	function initClimatePreview(locationName) {
		$.simpleWeather({
		    location: locationName,
		    woeid: '',
		    unit: 'c',
		    success: function(weather) {
		      $('#loadingPanelClimate_'+locationName).hide();
		      
		      var html = '<div class="col-xs-12 col-sm-12 col-lg-12 col-md-12">' +
		      				'<div class="row">' +	
	      			    		'<h2 class="text-center">' +
	      			    			weather.temp + '&deg;' + weather.units.temp +
	      			    			'<img src="'+weather.thumbnail+'" align="center">' +
	      			    		'</h2>' +
	      			    		'<p class="text-center">' + weather.title + '</p>' +
	      			    		'<p class="text-center"> Current Conditions: ' + weather.currently + '</p>' +
	      			    		'<p class="text-center"> Maximum: ' + weather.high + '&deg;' + weather.units.temp + ', Minimum: ' + weather.low + '&deg;' + weather.units.temp +  '</p>' +
	      			    	'</div>' +
		      			'</div>' +
		      			'<hr>';
		      			
		      html += 	'<div class="row" style="padding-left: 10px;">' +
					      '<div class="col-md-2">' +
							'<div class="thumbnail">' +
								'<img src="http://www.global-ambassador.org/image/220x220/weatherforecast.png">' + 
							'</div>' +
						   '</div>';
						
		      $.each(weather.forecast, function(index, value){
		    	  html += '<div class="col-md-2">' +
	    	  					'<h4>' +
	    	  						'<img class="media-object" src="'+value.thumbnail+'" alt="'+value.text+'">' +
	    	  						value.high + '&deg;' + weather.units.temp + 
	    	  					'</h4>' +
	    	  					'<p>' + value.date + ', ' + value.day + '</p>' +
    	  		  		  '</div> <!-- /col-md-2 -->';
		      });
		      
		      html += '</div> <!-- /row -->';
		  
		      $("#cliamtePreview-panel_"+locationName).html(html);
		    },
		    error: function(error) {
		      $("#cliamtePreview-panel_"+locationName).html('<p>'+error+'</p>');
		    }
		  });
	}
	
	$('#restaurantsNav').on('click', function(e){
		$('#restaurantMsg').slideToggle('show');
		$('#restaurants_'+activeLocation).slideToggle('show');
		
		if($('#restaurantCarousel_'+activeLocation).find('.carousel-inner').contents().length === 0) {
			isRestActive = true;
			initRestaurants(activeLocation);
		} else {
			console.log('restaurantCarousel_'+activeLocation+' already rendered')
		}	
	});
	
	$('#accomodationNav').on('click', function(e){
		$('#accomodationMsg').slideToggle('show');
		$('#accomodation_'+activeLocation).slideToggle('show');
		
		$('#budgetRangeSlider_'+activeLocation).slider().on('slideStop', rangeSliderCallBack);
		$('#ratingFilter_'+activeLocation).find('.btn').on('click', ratingFilter);
		
		if($('#hotelCarousel_'+activeLocation).find('.carousel-inner').contents().length === 0) {
			isAccomodationActive = true;
			mapInitialize(activeLocation);
		} else {
			console.log('hotelCarousel_'+activeLocation+' already rendered')
		}
		
	});
	
	$('#placesToVisitNav').on('click', function(e){
		$('#placesToVisitMsg').slideToggle('show');
		$('#places-to-visit_'+activeLocation).slideToggle('show');
		
		if($('#placesToVisitCarousel_'+activeLocation).find('.carousel-inner').contents().length === 0) {
			isPTVActive = true;
			initPlacesToVisit(activeLocation);
		} else {
			console.log('placesToVisitCarousel_'+activeLocation+' already rendered')
		}
	});
	
	$('#climateNav').on('click', function(e){
		$('#cliamtePreviewMsg').slideToggle('show');
		$('#climate-preview_'+activeLocation).slideToggle('show');
		
		if($('#cliamtePreview-panel_'+activeLocation).contents().length === 0) {
			initClimatePreview(activeLocation);
		} else {
			console.log('cliamtePreview-panel_'+activeLocation+' already rendered')
		}
		
	});
	
	$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		console.log('Now on tab for location: ' + $(e.target).data("locname")); // activated tab
		
		activeLocation = $(e.target).data("locname");
	
	});
	
	//reset the placeDetailsId after closing placeDetailsModal
	$('#detailsOkBtn').on('click', function(){
		//clear the modal
		$('#carousel-details').find('.carousel-inner').empty();
		$('#myModalLabel').empty();
		$('#reviews-panel').empty();
		$('#detailsPanel').empty();
		
		console.log('setting placeDetailsId as undefined');
		placeDetailsId = 'undefined';
	});
	
	//callback function for slider events
	function rangeSliderCallBack(ev) {
		var filterCostValue = $('#budgetRangeSlider_'+activeLocation).data('slider').getValue();
		var hotelListDivs = $('#hotelCarousel_' + activeLocation).find('.carousel-inner').find('.col-md-3');
	  
		console.log('Filtering hotels below price : ' + filterCostValue);
		$.each(hotelListDivs, function(index, value){
			var hotelCost = $(value).data('cost');
		  
			if(hotelCost > filterCostValue) {
				$(value).hide();
			}
			else {
				$(value).show();
			}
		});
	}
	
	//callback function for rating checkbox events
	function ratingFilter() {
		var array = [];
		var count = 1;
		var ratingDivs = $('#ratingFilter_'+activeLocation).find('input');
		$.each(ratingDivs, function(index, value){
			if($(value).is(':checked')) {
				array.push(count);
			}
			count++;
		});
		
		var hotelListDivs = $('#hotelCarousel_' + activeLocation).find('.carousel-inner').find('.col-md-3');
		$.each(hotelListDivs, function(index, value){
			var hotelRating = $(value).data('rating');			
			
			if($.inArray(hotelRating, array) === -1) {
				$(value).hide();
			}
			else {
				$(value).show();
			}
		});		
	}
	
	detailsInitialize();
	
});