$(document).ready(function(){
	console.log('[sharedTripsScript.js | document.ready] Getting saved trips as JSON');
	
	$.getJSON('/trip/sharedTrips/json', function(data){
		console.log('[sharedTripsScript.js | $.getJSON] received json: ' + JSON.stringify(data));
		var html = '';
		var count = 1;
		
		if(data.length == 0) {
			html+= '<h3>Sorry, No Trips have been shared with the community yet. Go ahead, create your trip <a href="/trip/plan">here</a></h3>'; 
		}
		$.each(data, function(index, value) {
			console.log('value before: ' + value);
			value = value["0"];
			console.log('value after: ' + value);
			
			html += '<div class="col-sm-6 col-md-4">' + 
						'<div class="thumbnail">' +
							'<img src="/images/tripImg'+count+ '.jpg">' +
							'<div class="caption">' +
								'<h4>' + value.locations + '</h4>' +
								'<p> By: ' + value.username + '</p>' +
								'<p> From: ' + value.startDate + ' To: ' + value.endDate + '</p>' +
								'<p><a href="/users/savedTrips/'+ value.username +'/'+ value._id +'" target="_blank" class="btn btn-primary" role="button">Details</a></p>' +
							'</div>' +
						'</div>' +
					'</div>';
			
			count++;
			if(count == 4){
				count = 1;
			}
		});
		
		$('#sharedTripsPanel').append(html);
	});
});