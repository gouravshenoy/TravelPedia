var json = '{' +
    '"username": "gourav_shenoy@persistent.co.in",' +
    '"startDate": "07/28/2014",' +
    '"endDate": "07/30/2014",' +
    '"locations": ['+
        '"BANGALORE",'+
        '"MAHABALESHWAR",'+
        '"MUMBAI"'+
    '],'+
    '"BANGALORE_accomodations": ['+
        '"The Leela Palace Bangalore__6030",'+
        '"Le Meridien Bangalore__1905"'+
    '],'+
    '"BANGALORE_restaurants": ['+
        '"Karavalli Restaurant",'+
        '"Caperberry Restaurant",'+
        '"Little Italy"'+
    '],'+
    '"BANGALORE_ptv": "Wonderla Amusement Park",'+
    '"MAHABALESHWAR_restaurants": ['+
        '"Monginis",'+
        '"United 21 Resort, Mahabaleshwar",'+
        '"Cafe Coffee Day - Mahabaleshwar"'+
    '],'+
    '"MUMBAI_accomodations": ['+
        '"Sun-n-Sand Mumbai__2393",'+
        '"The Oberoi, Mumbai__6479"'+
    '],'+
    '"MUMBAI_restaurants": ['+
        '"Delhi Darbar Restaurant",'+
        '"Copper Chimney",'+
        '"The Little Door - Mumbai",'+
        '"KFC"'+
    '],'+
    '"MUMBAI_ptv": ['+
        '"Azad Maidan",'+
        '"Afghan Church",'+
        '"St. Michael\'s Church",'+
        '"Oberoi Shopping Mall"'+
    ']'+
'}';


/* TEMPORARY JSON DATA TESTING */
router.get('/plan/confirm', function(req, res){
	console.log('[TRIP.js | get /plan/confirm] jsonBody -->' + json);
	var jsonResponse = buildJSON(JSON.parse(json));
	
	res.render('tripConfirm', {'tripJSON': jsonResponse});
});