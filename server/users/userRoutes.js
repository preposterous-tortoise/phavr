var userController = require('./userController.js');

module.exports = function (app) {
  app.route('/updateloc')
    .post(userController.updateLocation);
   app.route('/update')
     .post(userController.update);
};