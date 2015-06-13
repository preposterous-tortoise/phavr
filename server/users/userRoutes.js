var userController = require('./userController.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function (app) {

	app.use('/', function(req,res, next){
    if (req.body.location) {
      req.body.lng = req.body.location.longitude;
      req.body.lat = req.body.location.latitude;
      req.body.timeStamp = req.body.location.recorded_at;
    }
    next();
  	});

  app.route('/updateloc')
    .post(userController.update);
   app.route('/update')
    .post(userController.update);
};

