var userController = require('./userController.js');

module.exports = function (app) {

	app.use('/', function(req,res, next){

    req.body.lng = req.body.location.longitude;
    req.body.lat = req.body.location.latitude;
    req.body.timeStamp = req.body.location.recorded_at;
    next();
  	});

  app.route('/updateloc')
    .post(userController.updateLocation);
};
 