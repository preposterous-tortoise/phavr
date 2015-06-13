var favorController = require('./favorController.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function (app) {
  app.route('/')
    .post(favorController.fetchFavors);

  app.route('/create')
    .post(favorController.createFavor);

  app.route('/grabFavor')
    .post(favorController.grabFavor);
};