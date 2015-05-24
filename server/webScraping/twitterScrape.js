var Twitter = require("twitter");
var credentials = require('./twitterCredentials.js');

var client = Twitter({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});

module.exports = {
	
	getPhotosByLocation: function(req, res) {
		console.log("I'm here oh yea");

		client.get('search/tweets', {
			q: "marina bay sands",
			
			result_type: 'recent',
			count: 5
		}, function (error, tweets, response) {

			if (error) {
			    console.log("Error getting data from Twitter API");
			    console.log(error);
			    res.send(404, "Sorry, bad Twitter handle - try again");
			} else {
				res.json(tweets);
			}
		})


	}
}