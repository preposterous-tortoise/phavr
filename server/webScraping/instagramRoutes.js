var instagram = require('./instagramScrape.js');

module.exports = function(app) {
	app.post('/', instagram.getPhotosByLocation);
};
