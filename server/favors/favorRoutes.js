var favorController = require('./favorController.js');

module.exports = function (app) {
  app.route('/')
    .post(favorController.fetchFavors);

  app.route('/create')
    .post(favorController.createFavor);

  app.route('/update')
    .post(favorController.updateFavor);

  app.route('/upVote')
    .post(favorController.upVoteFavor);

  app.route('/downVote')
    .post(favorController.downVoteFavor);

  app.route('/grabFavor')
    .post(favorController.grabFavor);
};