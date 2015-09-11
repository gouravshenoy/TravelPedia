var env = JSON.parse(process.env.VCAP_SERVICES);
var mailprops = getEnv(env);

/**
 * Need to ignore the version number of DataCache when getting the credentials.
 */
function getEnv(vcapEnv) {
	
	var sendgrid = vcapEnv['sendgrid'];
	
	if(!sendgrid) {
		console.log('[email.js | getEnv] Sendgrid Service is unavailable');
		throw new Error('[email.js | getEnv] Sendgrid Service is currently unavailable');
	}
	console.log('[email.js | getEnv] sendgrid creds: ' + JSON.stringify(sendgrid[0].credentials));
	
   return sendgrid[0].credentials;
}

module.exports = {
	'username': mailprops.username,
	'password': mailprops.password
};