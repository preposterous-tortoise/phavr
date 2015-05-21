var photoController = require('./photoController.js');

module.exports = function (app) {
  app.route('/create')
    .post(photoController.createPhoto);

  app.route('/update')
    .post(photoController.updatePhoto);
};