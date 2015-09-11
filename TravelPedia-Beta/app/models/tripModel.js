// app/models/tripModel.js
// load the things we need
var mongoose = require('mongoose');

//define the schema for our trip model
var tripSchema = mongoose.Schema(
	{
		//dynamic schema
	},
	{
		strict : false
	});

// create the model for trip and expose it to our app
module.exports = mongoose.model('Trip', tripSchema);