var twitter = require('./twitterScrape.js');

module.exports = function(app) {
	app.get('/', twitter.getPhotosByLocation);
}