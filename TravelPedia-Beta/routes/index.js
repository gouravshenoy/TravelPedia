//routes.js

//mail utility js for sending mail
var mail_util = require('../mail_util.js'),
	fs = require('fs');

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	// show the home page
	app.get('/', isLoggedIn, function(req, res) {

		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	// =====================================
	// LOGIN PAGE  =========================
	// =====================================
	// show the login page
	app.get('/login', function(req, res) {
		
		// render the login page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage')}); 
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the login page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// REGISTER ============================
	// =====================================
	// show the register form
	app.get('/register', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('register.ejs', { message: req.flash('signupMessage') });
	});

	// process the register form
	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/email_notify', // redirect to the secure email notification section
		failureRedirect : '/register', // redirect back to the register page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	// =====================================
	// EMAIL NOTIFICATION SECTION ==========
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/email_notify', isLoggedIn, function(req, res) {
		var user = req.user;
		var email = user.local.email;
		console.log('[INDEX.js | get /email_notify] User object: ' + JSON.stringify(user) + ', Sending mail notification to: ' + email);
		
		mail_util.sendEmail(email);
		
		res.render('profile.ejs', {
			user : req.user, // get the user out of session and pass to template
			successMsg: 'Congratulations, You have been registered successfully. A confirmation mail has been sent to your registered email-id.'
		});	
	});

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.session.destroy();
		req.logout();
		res.redirect('/');
	});
	
	// =====================================
	// APP LOGO ============================
	// =====================================
	app.get('/travelpediaLogo', function(req, res) {
		fs.readFile('public/images/logo.png', function(err, data) {
			if (err) throw err; // Fail if the file can't be read.		
			res.writeHead(200, {'Content-Type': 'image/png'});
			res.end(data); // Send the file data to the browser.
		});
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.render('index.ejs', { message: req.flash('loginMessage') });
}