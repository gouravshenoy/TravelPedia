// app/models/guestbook.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our guestbook model
var guestBookSchema = mongoose.Schema(
	{
        name		: String,
        location	: String,
        comments	: String
    });

// create the model for guestbooks and expose it to our app
module.exports = mongoose.model('GuestBook', guestBookSchema);
