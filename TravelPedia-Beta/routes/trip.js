var express = require('express');
var Trip = require('../app/models/tripModel');
var SharedTrip = require('../app/models/SharedTrips');
var mail_util = require('../mail_util.js');
var router = express.Router();

/* Plan the trip -- render the location selector page */
router.get('/plan', function(req, res){
	res.render('locationSelect');
});

/* Plan the trip -- render the location selector page */
router.post('/build', isLoggedIn, function(req, res){
	console.log('[TRIP.js | post /build] req body -->' + JSON.stringify(req.body));
	
	var origin = req.body.origin;
	var destination = req.body.destination;
	var waypoints = req.body.waypoints;
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;
	var username = req.user.local.email;
	
	var locations = [];
	
	if(waypoints && (typeof waypoints == 'object')) {	
		//waypoints is of type: ARRAY
		waypoints = waypoints.unique();
		
		for(var i=0; i<waypoints.length; i++){
			console.log('[TRIP.js | post /build] waypoint: ' + waypoints[i]);
			locations.push(waypoints[i]);
		}
	} else if(waypoints && (typeof waypoints == 'string')) {
		//waypoints is of type: STRING
		locations.push(waypoints);
	}

	//push the locations into an array
	if(origin !== destination) {
		locations.push(destination);
	}
	
	console.log('[TRIP.js | post /build] Final Locations: ' + locations);

	// ############################################################
	// # perform other operation if required -- save trip data, etc
	// ############################################################
	res.render('tripBuilder', {
								'holidayLocations': locations, 
								'startDate': startDate, 
								'endDate': endDate,
								'username': username
							}
	);
	
});

/* Trip confirmation page */
router.post('/plan/confirm', isLoggedIn, function(req, res){
	console.log('[TRIP.js | post /plan/confirm] req body -->' + JSON.stringify(req.body));
	var jsonResponse = buildJSON(req.body);
	
	//save the trip in session, to simplify saving in db later
	req.session.myTrip = jsonResponse;	

	//show the confirmation page
	res.render('tripConfirm', {'tripJSON': jsonResponse});
});

/* Save trip information in db */
router.get('/save', isLoggedIn, function(req, res){
	var tripJSON = req.session.myTrip;
	
	tripJSON.isShared = false;
	console.log('[TRIP.js | get /save] tripJSON : ' + tripJSON);
	
	var tripRecord = new Trip(tripJSON);
	tripRecord.save(function(err, tripRecord) {
		if (err) return console.error(err);
		console.dir('[TRIP.js | get /save] saved trip record: ' + tripRecord);
		
		//send email to customer
		mail_util.sendTripEmail(req.session.username);
		
		//redirect and show the saved trips
		res.redirect('/users/savedTrips');
	});
});

/* Share trip information with community */
router.get('/share/:tripId', isLoggedIn, function(req, res){
	var tripId = req.params.tripId;
	console.log('[TRIP.js | get /share/:tripId] tripId : ' + tripId);
	
	// Find the trip record and share it - insert in db
	Trip.find({'_id': tripId}, function(err, trip) {
		if (err) return console.error(err);
		console.dir('[USERS.js | get /share/:tripId] trip record retreived: ' + trip);
		
		//create a new record in the shared collection
		var sharedTripRecord = new SharedTrip(trip);
		sharedTripRecord.save(function(err, sharedTripRecord){
			if (err) return console.error(err);
			console.dir('[TRIP.js | get /share/:tripId] shared trip record: ' + sharedTripRecord);
			
			//update the existing trip record to set isShared = true
			Trip.update({'_id': tripId}, {'isShared': true}, {upsert: false}, function(err, updatedRecord){
				if (err) return console.error(err);
				console.dir('[TRIP.js | get /share/:tripId] updated trip record: ' + updatedRecord);
				
				//get the trip info after update
				Trip.find({'_id': tripId}, function(err, trip) {
					if (err) return console.error(err);
					res.render('savedTripDetails', {'tripJSON': trip});
				});
			});
		});
		
	});
});

/* GET shared trips for user */
router.get('/sharedTrips', function(req, res) {
	res.render('sharedTrips');
});

/* GET shared trips for community */
router.get('/sharedTrips/json', function(req, res) {	
	// Find all shared trip records.
	SharedTrip.find({}, function(err, sharedTrips) {
		if (err) return console.error(err);
		console.dir('[USERS.js | get /sharedTrips/json] sharedTrips records: ' + sharedTrips);
		
		res.json(sharedTrips);
	});
});

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

function getDateDifference(d1, d2){
	 var t2 = d2.getTime();
     var t1 = d1.getTime();

     return Math.round((t2-t1)/(24*3600*1000));
}

function buildJSON(jsonBody) {
	var jsonRes = {};
	var locations = jsonBody.locations;
	console.log('[TRIP.js | buildJSON] locations --> ' + locations);
	
	jsonRes.username = jsonBody.username;
	jsonRes.startDate = jsonBody.startDate;
	jsonRes.endDate = jsonBody.endDate;
	jsonRes.locations = locations;
	
	var d1 = new Date(jsonBody.startDate);
	var d2 = new Date(jsonBody.endDate);
	
	//calculate the number of days to stay at a particular location
	var dayDiff = getDateDifference(d1, d2);
	console.log('[TRIP.js | buildJSON] date difference : ' + dayDiff);
	
	if(locations && (typeof locations == 'object')) {
		//multiple locations
		console.log('multiple locations --> length: ' + locations.length);
		
		//how long to stay at each location
		var eachLocationStayDuration = Math.round(dayDiff / locations.length);		
		
		for(var i=0; i<locations.length; i++) {
			var locationName = locations[i];
			var accomodations = locationName+"_accomodations";
			var restaurants = locationName+"_restaurants";
			var ptvs = locationName+"_ptv";
			
			var accomodationArray = [];		
			var restaurantArray = [];		
			var ptvArray = [];
			
			var jsonForLocation = {};
			
			////////////////////////////////////////////
			//	ACCOMODATION JSON
			///////////////////////////////////////////
			if(jsonBody[accomodations] && (typeof jsonBody[accomodations] == 'object')) {
				for(var ac=0; ac<jsonBody[accomodations].length; ac++){
					accomodationArray.push(jsonBody[accomodations][ac]);
				}					
			}
			else if(jsonBody[accomodations] && (typeof jsonBody[accomodations] == 'string')) {
				accomodationArray.push(jsonBody[accomodations]);
			}
			
			jsonForLocation.accomodations = accomodationArray;
			
			////////////////////////////////////////////
			//	RESTAURANTS JSON
			///////////////////////////////////////////
			if(jsonBody[restaurants] && (typeof jsonBody[restaurants] == 'object')) {
				for(var rs=0; rs<jsonBody[restaurants].length; rs++){
					restaurantArray.push(jsonBody[restaurants][rs]);
				}						
			}
			else if(jsonBody[restaurants] && (typeof jsonBody[restaurants] == 'string')) {
				restaurantArray.push(jsonBody[restaurants]);
			}
			
			jsonForLocation.restaurants = restaurantArray;
			
			////////////////////////////////////////////
			//	PTV JSON
			///////////////////////////////////////////
			if(jsonBody[ptvs] && (typeof jsonBody[ptvs] == 'object')) {
				for(var pt=0; pt<jsonBody[ptvs].length; pt++){
					ptvArray.push(jsonBody[ptvs][pt]);
				}				
			}
			else if(jsonBody[ptvs] && (typeof jsonBody[ptvs] == 'string')) {
				ptvArray.push(jsonBody[ptvs]);
			}
			
			jsonForLocation.ptv = ptvArray;
			
			var dd = d1.getDate();
			var mm = d1.getMonth() + 1;
			var y = d1.getFullYear();
			jsonForLocation.startDateHere = dd + '/'+ mm + '/'+ y;
			
			//move ahead number of days
			d1.setDate(d1.getDate() + eachLocationStayDuration);
			dd = d1.getDate();
			mm = d1.getMonth() + 1;
			y = d1.getFullYear();
			jsonForLocation.endDateHere = dd + '/'+ mm + '/'+ y;
			
			//put in final json
			jsonRes[locationName] = jsonForLocation;
		}
		// end --for
	}
	// end --if
	else if(locations && (typeof locations == 'string')) {
		//single location
		
		var accomodations = locations+"_accomodations";
		var restaurants = locations+"_restaurants";
		var ptvs = locations+"_ptv";
		
		var accomodationArray = [];		
		var restaurantArray = [];		
		var ptvArray = [];	
		
		var jsonForLocation = {};
		
		////////////////////////////////////////////
		//	ACCOMODATION JSON
		///////////////////////////////////////////
		if(jsonBody[accomodations] && (typeof jsonBody[accomodations] == 'object')) {
			for(var ac=0; ac<jsonBody[accomodations].length; ac++){
				accomodationArray.push(jsonBody[accomodations][ac]);
			}					
		}
		else if(jsonBody[accomodations] && (typeof jsonBody[accomodations] == 'string')) {
			accomodationArray.push(jsonBody[accomodations]);
		}
		
		jsonForLocation.accomodations = accomodationArray;
		
		////////////////////////////////////////////
		//	RESTAURANTS JSON
		///////////////////////////////////////////
		if(jsonBody[restaurants] && (typeof jsonBody[restaurants] == 'object')) {
			for(var rs=0; rs<jsonBody[restaurants].length; rs++){
				restaurantArray.push(jsonBody[restaurants][rs]);
			}						
		}
		else if(jsonBody[restaurants] && (typeof jsonBody[restaurants] == 'string')) {
			restaurantArray.push(jsonBody[restaurants]);
		}
		
		jsonForLocation.restaurants = restaurantArray;
		
		////////////////////////////////////////////
		//	PTV JSON
		///////////////////////////////////////////
		if(jsonBody[ptvs] && (typeof jsonBody[ptvs] == 'object')) {
			for(var pt=0; pt<jsonBody[ptvs].length; pt++){
				ptvArray.push(jsonBody[ptvs][pt]);
			}				
		}
		else if(jsonBody[ptvs] && (typeof jsonBody[ptvs] == 'string')) {
			ptvArray.push(jsonBody[ptvs]);
		}
		
		jsonForLocation.ptv = ptvArray;
		
		var dd = d1.getDate();
		var mm = d1.getMonth() + 1;
		var y = d1.getFullYear();
		jsonForLocation.startDateHere = dd + '/'+ mm + '/'+ y;
		
		dd = d2.getDate();
		mm = d2.getMonth() + 1;
		y = d2.getFullYear();
		jsonForLocation.endDateHere = dd + '/'+ mm + '/'+ y;
		
		//put in final json
		jsonRes[locations] = jsonForLocation;
	}
	
	console.log('[TRIP.js | buildJSON] json response: ' + JSON.stringify(jsonRes));
	return jsonRes;
}

//route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.render('locationSelect', { message: 'You need to be logged in to start building your trip! Please register for a free account, or else sign-in if already registered.' });
}

module.exports = router;