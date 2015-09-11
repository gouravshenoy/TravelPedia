var express = require('express');
var Trip = require('../app/models/tripModel');
var router = express.Router();


/* GET saved trips for user */
router.get('/savedTrips', function(req, res) {
	var username = req.session.username
	console.log('[USERS.js | get /savedTrips] Username: ' + username);
	res.render('savedTrips', {'username': username});
});

/* GET saved trips for user */
router.get('/savedTrips/json', function(req, res) {
	var username = req.session.username
	console.log('[USERS.js | get /savedTrips/json] Username: ' + username);
	
	// Find all trip records.
	Trip.find({'username': username}, function(err, trips) {
		if (err) return console.error(err);
		console.dir('[USERS.js | get /savedTrips/json] trips records: ' + trips);
		
		res.json(trips);
	});
});

/* GET saved trips for user */
router.get('/savedTrips/:username/:tripId', function(req, res) {
	var tripId = req.params.tripId;
	var username = req.params.username
	
	console.log('[USERS.js | get /savedTrips/:tripId] Username: ' + username + ', tripId: ' + tripId) ;
	
	// Find all trip records.
	Trip.find({'username': username, '_id': tripId}, function(err, trip) {
		if (err) return console.error(err);
		console.dir('[USERS.js | get /savedTrips/:tripId] trip record retreived: ' + trip);
		
		res.render('savedTripDetails', {'tripJSON': trip});
	});
});

module.exports = router;
