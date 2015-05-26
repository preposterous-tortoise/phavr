var ig = require('instagram-node').instagram();

	var igCredentials;

if(process.env.PRODUCTION) {
	ig.use({
		client_id: process.env.instagram_clientID,
		client_secret: process.env.instagram_client_secret 
	});
} else {
	igCredentials = require('./instagramCredentials.js');

	ig.use({
		client_id: igCredentials.instagram_client_ID,
		client_secret: igCredentials.instagram_client_secret 
	});
}




module.exports =  {
	getPhotosByLocation: function(req,res){

		// console.log(, req.body.long);
		console.log("req.body")
		console.log(req.body);

		ig.location_search({ lat: req.body.lat, lng: req.body.long }, {distance:100} ,function(err, result, remaining, limit) {

			console.log(result);
			ig.location_media_recent(result[0].id, function(err, result, pagination, remaining, limit) {
				res.json(result);
			});			
		});

		// ig.location_media_recent('16334271', function(err, result, pagination, remaining, limit) {
		// 	res.json(result);
		// });
	}
}


