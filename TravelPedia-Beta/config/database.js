// config/database.js

var env = JSON.parse(process.env.VCAP_SERVICES);
var dbprops = getEnv(env);

/**
 * Need to ignore the version number of DataCache when getting the credentials.
 */
function getEnv(vcapEnv) {
	
	var mongodb = vcapEnv['mongolab'];
	
	if(!mongodb) {
		console.log('[database.js | getEnv] Mongo Service is unavailable');
		throw new Error('[database.js | getEnv] MongoDB Service is currently unavailable');
	}
	console.log('[database.js | getEnv] mongodb creds: ' + JSON.stringify(mongodb[0].credentials));
	
   return mongodb[0].credentials;
}

module.exports = {

	'url' : dbprops.uri // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};