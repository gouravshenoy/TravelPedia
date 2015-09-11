var configEmail = require('./config/email');

/* SENDGRID CREDENTIALS
 * Enter in your SendGrid username and 
 * password below.
 *===========================================*/
var sg_username = configEmail.username;
var sg_password = configEmail.password;

function sendEmail(toAddress) {

	/* MAIL INFORMATION
	 * Fill in the relevant information below
	 *===========================================*/
	// YOUR SENDING ADDRESS
	var from_address = "admin@travelpedia.co.in";

	// YOUR TO ADDRESS(ES)
	var to_address = toAddress;

	// SUBJECT
	var subject = "TravelPedia! Welcome on-board";

	// HTML BODY
	var html_body = "<table style=\"border: solid 1px #000; background-color: #666; font-family: verdana, tahoma, sans-serif; color: #fff;\"> <tr> <td> <h2>Congratulations!</h2> <p>You have been successfully registered to TravelPedia. We thank you for selecting our application & wish you a happy experience exploring our application.</p><br><p>You can access the application online here at:: <a href=\"http://travelpedia.mybluemix.net\">TRAVELPEDIA</a> ::</p> <br><br>Love,<br/> Your friends at Travelpedia</p> <p> <img src=\"http://localhost:3000/travelpediaLogo\" alt=\"SendGrid!\" /> </td> </tr> </table>";


	/* CREATE THE MAIL OBJECT
	 *===========================================*/
	// This will send your email via SendGrid's Web API.  If you
	// wish to send it via SMTP, use the following line instead:
	// var sendgrid  = require("sendgrid")(sg_username, sg_password, {api: 'smtp'});
	var sendgrid = require("sendgrid")(sg_username, sg_password);


	/* SEND THE MAIL
	 *===========================================*/
	try {
		sendgrid.send({
			to:         to_address,
			from:       from_address,
			subject:    subject,
			html:       html_body
		}, function(err, json) {
			if (err) return console.error(err);
			console.log('[mail_util.js | sendEmail] success email sending: ' + json);
		});
	} catch(e) {
		console.log('[mail_util.js | sendEmail] error email sending: ' + e);
	}
}

function sendTripEmail(toAddress, tripId) {

	/* MAIL INFORMATION
	 * Fill in the relevant information below
	 *===========================================*/
	// YOUR SENDING ADDRESS
	var from_address = "admin@travelpedia.co.in";

	// YOUR TO ADDRESS(ES)
	var to_address = toAddress;

	// SUBJECT
	var subject = "TravelPedia! Your Planned Trip";

	// HTML BODY
	var html_body = "<table style=\"border: solid 1px #000; background-color: #666; font-family: verdana, tahoma, sans-serif; color: #fff;\"> <tr> <td> <h2>Awesome!</h2> <p>You have successfully created your personalized trip on TravelPedia.</p><br><p>You can visit the page to your trip at:: <a href=\"http://travelpedia.mybluemix.net/"+toAddress+"/"+tripId+"\">My Trip</a> ::</p> <br><br>Love,<br/> Your friends at Travelpedia</p> <p> <img src=\"http://travelpedia.mybluemix.net/travelpediaLogo\" alt=\"SendGrid!\" /> </td> </tr> </table>";


	/* CREATE THE MAIL OBJECT
	 *===========================================*/
	// This will send your email via SendGrid's Web API.  If you
	// wish to send it via SMTP, use the following line instead:
	// var sendgrid  = require("sendgrid")(sg_username, sg_password, {api: 'smtp'});
	var sendgrid = require("sendgrid")(sg_username, sg_password);


	/* SEND THE MAIL
	 *===========================================*/
	try {
		sendgrid.send({
			to:         to_address,
			from:       from_address,
			subject:    subject,
			html:       html_body
		}, function(err, json) {
			if (err) return console.error(err);
			console.log('[mail_util.js | sendEmail] success email sending: ' + json);
		});
	} catch(e) {
		console.log('[mail_util.js | sendEmail] error email sending: ' + e);
	}
}

function sendContactEmail(from_address, subject, name, message) {

	/* MAIL INFORMATION
	 * Fill in the relevant information below
	 *===========================================*/
	// YOUR TO ADDRESS(ES)
	var to_address = "gourav_shenoy@persistent.co.in";

	/* CREATE THE MAIL OBJECT
	 *===========================================*/
	// This will send your email via SendGrid's Web API.  If you
	// wish to send it via SMTP, use the following line instead:
	// var sendgrid  = require("sendgrid")(sg_username, sg_password, {api: 'smtp'});
	var sendgrid = require("sendgrid")(sg_username, sg_password);


	/* SEND THE MAIL
	 *===========================================*/
	try {
		sendgrid.send({
			to:         to_address,
			from:       from_address,
			subject:    subject,
			text:       name + ', has sent you a message: ' + message
		}, function(err, json) {
			if (err) return console.error(err);
			console.log('[mail_util.js | sendEmail] success email sending: ' + json);
		});
	} catch(e) {
		console.log('[mail_util.js | sendEmail] error email sending: ' + e);
	}
}

exports.sendEmail = sendEmail;
exports.sendTripEmail = sendTripEmail;
exports.sendContactEmail = sendContactEmail;