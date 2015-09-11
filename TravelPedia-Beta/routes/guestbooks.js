var express = require('express');
var router = express.Router();
var GuestBook = require('../app/models/guestbook');

/* GET guestbook records. */
router.get('/', function(req, res) {

	// Find all guestbook records.
	GuestBook.find(function(err, guestbooks) {
		if (err) return console.error(err);
		console.dir('[GUESTBOOKS.js | get /] GuestBook records: ' + guestbooks);
		res.json(guestbooks);
	});

});

/* Insert guestbook record. */
router.get('/insertDummy', function(req, res) {
	console.log('[GUESTBOOKS.js | get /insertDummy] Inserting dummy guestbook record');
	
	var gbRecord = new GuestBook({
		name		: 'Guest Name',
        location	: 'Goa',
        comments	: 'Very very good Application'
	});
	
	// Save guestbook comments.
	gbRecord.save(function(err, gbRecord) {
		if (err) return console.error(err);
		console.dir('[GUESTBOOKS.js | get /insertDummy] saved dummy record: ' + gbRecord);
	});
	
	res.json(gbRecord);
});

/* Insert guestbook record. */
router.post('/', function(req, res) {
	console.log('[GUESTBOOKS.js | post /] Inserting guestbook record into database');
	
	var gbRecord = new GuestBook({
		name		: req.body.custName,
        location	: req.body.custLocation,
        comments	: req.body.custComments
	});
	
	// Save guestbook comments.
	gbRecord.save(function(err, gbRecord) {
		if (err) return console.error(err);
		console.dir('[GUESTBOOKS.js | post /] Inserted record: ' + gbRecord);
	});
	
	req.flash('guestbookMsg', 'Your Comment has been added to our website. Thank you');
	res.redirect('/');	
});

module.exports = router;

