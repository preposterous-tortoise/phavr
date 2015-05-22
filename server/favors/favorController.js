var Favor = require('../db/favorModel.js');
var Q = require('q');

module.exports = {
  fetchFavors: function(req, res, next) {
  	// query = MyModel.where({loc: {$within : {$box : box}}});
   //  query.run(cb);
    res.send('fetchFavors called with body: ' + JSON.stringify(req.body));
  },
  createFavor: function(req, res, next) {
    
  	/*var collection = db.collection('places');

	  collection.ensureIndex({loc: "2d"}, {min: -500, max: 500, w:1}, function(err, result) {
	    if(err) return console.dir(err);

	    collection.insert(document, {w:1}, function(err, result) {
	      if(err) return console.dir(err)
	    });
	  });*/

		var favor = new Favor({
		  topic: 'dummy topic',
		  description: req.body.description,
		  user_id: 1,
		  photos: [],
		  loc: {
		  	"coordinates": [req.body.location.F, req.body.location.A]
		  },
		  votes: 0,
		  isPrivate: false
		});
		favor.save(function (err) {
		  if (err) console.log('ERROR in favor creation: ', err);
		  if (err) throw err;
		  //done(null, user);
		});
    res.send('createFavor called with body: ' + JSON.stringify(req.body));
  },
  updateFavor: function(req, res, next) {
    res.send('updateFavor called with body: ' + JSON.stringify(req.body));
  }
}