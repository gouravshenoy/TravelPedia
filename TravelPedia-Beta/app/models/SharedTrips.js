// app/models/SharedTrips.js
// load the things we need
var mongoose = require('mongoose');

//define the schema for our SharedTrips model
var sharedTripSchema = mongoose.Schema(
	{
		//dynamic schema
	},
	{
		strict : false
	});

// create the model for SharedTrips and expose it to our app
module.exports = mongoose.model('SharedTrips', sharedTripSchema);