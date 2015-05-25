var ig = require('instagram-node').instagram();
var igCredentials = require('./instagramCredentials.js');


ig.use({
	client_id: igCredentials.client_ID,
	client_secret: igCredentials.client_secret
});

module.exports =  {

	getPhotosByLocation: function(req,res){
		// ig.location_search({ lat: 48.8582, lng: 2.2945 }, {distance:100} ,function(err, result, remaining, limit) {
		// 	res.json(result);
		// });

		ig.location_media_recent('16334271', function(err, result, pagination, remaining, limit) {
			res.json(result);
		});
	}

}


