var express = require('express');
var mail_util = require('../mail_util.js');
var router = express.Router();

/* GET contact us form */
router.get('/', function(req, res) {
	res.render('contactus');
});

/* POST contact us form */
router.post('/submit', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var subject = req.body.subject;
	var message = req.body.message;
	
	mail_util.sendContactEmail(email, subject, name, message);
	res.render('contactus');
});

module.exports = router;