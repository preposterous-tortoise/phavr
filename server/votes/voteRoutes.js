var voteController = require('./voteController.js');
var votePhotoController = require('./votePhotoController.js');

module.exports = function (app) {
  app.route('/upVote')
    .post(voteController.upVote);

  app.route('/downVote')
    .post(voteController.downVote);

  app.route('/upVotePhoto')
  	.post(votePhotoController.upVote);

  app.route('/downVotePhoto')
  	.post(votePhotoController.downVote);
};