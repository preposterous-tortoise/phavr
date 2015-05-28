var voteController = require('./voteController.js');

module.exports = function (app) {
  app.route('/upVote')
    .post(voteController.upVote);

  app.route('/downVote')
    .post(voteController.downVote);
};