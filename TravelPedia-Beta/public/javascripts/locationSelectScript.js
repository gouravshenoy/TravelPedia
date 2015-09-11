var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var formObj;

$(document).ready(function(){
	
	$('#locationSelect').validate({
		submitHandler: function(form) {
			formObj = form;
			
			calcRoute();
			$('#mapModal').modal('show');		    
		}
	});
	
	$('#proceedBtn').on('click', function(e){
		console.log('[tripPlannerScript.js | #proceedBtn.on(click)] submitting form now');
		formObj.submit();
	});
	
	var currentCount = 1;
	var maxCount = 4;
	$('#waypoint-limit').hide();
	$('#field').on('click', '#addMoreBtn', function(e) {
		if(currentCount > maxCount) {
			$('#waypoint-limit').show();
			return;
		}
		$('#waypoint-empty').hide();
		var id = 'waypoint-'+currentCount;
		currentCount++;
		
		var inputField = '<div class="col-lg-12" style="padding-top: 5px; padding-bottom: 5px">' + 
							'<div class="input-group">' + 
								'<span class="input-group-addon">' +
									'Way Point' +
								'</span>' +
								'<input name="waypoints" type="text" class="form-control required waypoints" placeholder="Stop Over Destination">' +
								'<span class="input-group-btn">' +
									'<button type="button" id="removeLocBtn" class="btn btn-danger">remove</button>' +
								'</span>' +
							'</div>' +
						'</div>';
				
		$(inputField).appendTo('#waypointContainer');
	});

	$('#waypointContainer').on('click', "#removeLocBtn", function(e){
		if(currentCount > 1) {
			$('#waypoint-limit').hide();
			var div1 = $(this).closest('div');
			var div2 = $(div1).parent('div.col-lg-12');
			$(div2).remove();
			currentCount--;
		}

		if(currentCount == 1) {
			$('#waypoint-empty').show();
		} 
	});
	
	$('#startDate').datepicker({ 
	    dateFormat: 'dd/mm/yyyy',
	    changeMonth: true,
	    minDate: new Date(),
	    maxDate: '+2y',
	    onSelect: function(date){

	        var selectedDate = new Date(date);
	        var msecsInADay = 86400000;
	        var endDate = new Date(selectedDate.getTime() + msecsInADay);

	        $("#endDate").datepicker( "option", "minDate", endDate );
	        $("#endDate").datepicker( "option", "maxDate", '+2y' );

	    }
	}); 
	
	$('#endDate').datepicker({
        dateFormat: 'dd/mm/yyyy',
        changeMonth: true
    });
	
	function mapInitialize(){ 
		directionsDisplay = new google.maps.DirectionsRenderer();
		var chicago = new google.maps.LatLng(41.850033, -87.6500523);
		var mapOptions = {
		zoom: 20,
		center: chicago
		}
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		directionsDisplay.setMap(map);
	}
	
	function calcRoute() {
		var waypts = [];
		console.log('[tripPlannerScript.js | calcRoute] Calculating route');
		
		var originPlace = document.getElementById('origin').value;
		var destinationPlace = document.getElementById('destination').value;
		var wayPointsContainer = $('#waypointContainer').children('div');
		console.log('[tripPlannerScript.js | calcRoute] length: ' + wayPointsContainer.length);
		$.each(wayPointsContainer, function(index, value) {
			var wayPointPlace = $(value).find('input');
			waypts.push({
			    location:wayPointPlace[0].value,
			    stopover:true
			});
		});
		
		var request = {
		  origin: originPlace,
		  destination: destinationPlace,
		  waypoints: waypts,
		  optimizeWaypoints: true,
		  travelMode: google.maps.TravelMode.DRIVING
		};
		
		console.log('[tripPlannerScript.js | calcRoute] waypoints-> ' + JSON.stringify(waypts));
		
		directionsService.route(request, function(response, status) {
			console.log('Status: ' + status);
			var summaryPanel = document.getElementById('directions-panel');
			
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				var route = response.routes[0];
				summaryPanel.innerHTML = '';
				console.log('[tripPlannerScript.js | calcRoute] routes: ' + JSON.stringify(response.routes[0]));
				// For each route, display summary information.
				for (var i = 0; i < route.legs.length; i++) {
					var routeSegment = i + 1;
					summaryPanel.innerHTML += '<span class="glyphicon glyphicon-flag"></span>'
					summaryPanel.innerHTML += '<b style="padding-bottom:10px">&nbsp;&nbsp; Route Segment: ' + routeSegment + '</b><br>';
					summaryPanel.innerHTML += '<span class="glyphicon glyphicon-map-marker"></span>';
					summaryPanel.innerHTML += '&nbsp;&nbsp; ' + route.legs[i].start_address;
					summaryPanel.innerHTML += '&nbsp;&nbsp; <span class="glyphicon glyphicon-arrow-right"></span>';
					summaryPanel.innerHTML += '&nbsp;&nbsp; <span class="glyphicon glyphicon-map-marker"></span>';
					summaryPanel.innerHTML += '&nbsp;&nbsp; ' + route.legs[i].end_address + '<br>';
					summaryPanel.innerHTML += '<span class="glyphicon glyphicon-road"></span>';
					summaryPanel.innerHTML += '&nbsp;&nbsp; ' + route.legs[i].distance.text;
					summaryPanel.innerHTML += '&nbsp;&nbsp; <span class="glyphicon glyphicon-time"></span>';
					summaryPanel.innerHTML += '&nbsp;&nbsp; ' + route.legs[i].duration.text + '<br><br>';
					
					$('#proceedBtn').removeAttr('disabled','disabled');
				}
			}
			else {
				summaryPanel.innerHTML = '<div class="alert alert-danger" role="alert">' +
										 '<strong>Sorry!</strong><br>No routes could be found the entered locations. Please verify the correctness of your locations.' +
									     '</div>';
				$('#proceedBtn').attr('disabled','disabled');
			}
		});
	}
	
	google.maps.event.addDomListener(window, "resize", resizingMap());

	$('#mapModal').on('show.bs.modal', function() {
	   //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
	   resizeMap();
	});

	
	function resizeMap() {
	   if(typeof map =="undefined") return;
	   setTimeout( function(){resizingMap();} , 400);
	}

	function resizingMap() {
	   if(typeof map =="undefined") return;
	   var center = map.getCenter();
	   google.maps.event.trigger(map, "resize");
	   map.setCenter(center); 
	}
	
	//init the map
	mapInitialize();
});