var Twitter = require("twitter");
var credentials = require('./twitterCredentials.js');

var client = Twitter({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
})