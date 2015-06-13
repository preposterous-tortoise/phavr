var voteController = require('./voteController.js');
var votePhotoController = require('./votePhotoController.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function (app) {
  app.route('/upVote')
    .post(voteController.upVote);

  app.route('/upVotePhoto')
  	.post(voteController.upVotePhoto);
};