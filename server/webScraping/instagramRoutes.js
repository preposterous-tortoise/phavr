var instagram = require('./instagramScrape.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function(app) {
	app.post('/', instagram.getPhotosByLocation);
};
