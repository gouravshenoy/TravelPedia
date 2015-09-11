$(document).ready(function(){
	
	$('#locationSelect').validate();
	
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
		
		var inputField = '<div class="col-lg-12">' + 
							'<div class="input-group">' + 
								'<span class="input-group-addon">' +
									'Way Point' +
								'</span>' +
								'<input id="endLoc" name="'+id+'" type="text" class="form-control" placeholder="Stop Over Destination">' +
								'<span class="input-group-btn">' +
									'<button type="button" id="removeLocBtn" class="btn btn-danger">remove</button>' +
								'</span>' +
							'</div>' +
						'</div>';
				
		$(inputField).appendTo('#waypointContainer');
	});

	$('#waypointContainer').on('click', "#removeLocBtn", function(e){
		console.log('clicked');
		if(currentCount > 1) {
			$('#waypoint-limit').hide();
			$(this).closest('div').closest('div').remove();
			currentCount--;
		}

		if(currentCount == 1) {
			$('#waypoint-empty').show();
		} 
	});
	
	$('#startDate').datepicker({
        format: "dd/mm/yyyy"
    }); 
	
	$('#endDate').datepicker({
        format: "dd/mm/yyyy"
    }); 
});