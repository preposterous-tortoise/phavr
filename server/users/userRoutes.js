var userController = require('./userController.js');

module.exports = function (app) {
  app.route('/updateloc')
    .post(userController.updateLocation);
};