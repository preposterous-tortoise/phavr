var photoController = require('./photoController.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function (app) {
  console.log('photo router');
  app.route('/create')
    .post(photoController.createPhoto);

  app.route('/create-dummy')
    .post(photoController.createDummyPhoto);

  app.route('/fetch')
    .post(photoController.fetchPhotosForFavor);

  // app.route('/update')
  //   .post(photoController.updatePhoto);

  // app.route('/upVote')
  //   .post(photoController.upVotePhoto);

  // app.route('/downVote')
  //   .post(photoController.downVotePhoto);

  app.route('/uploadToS3')
    .get(photoController.uploadToS3);

  app.route('/uploadToServer')
    .post(photoController.uploadToServer);
};
