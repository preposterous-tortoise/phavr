var Favor = require('../db/favorModel.js');
var Photo = require('../db/photoModel.js');
var Notifier = require('../push/pushNotify.js');
var utils = require('../utils/utils.js');
var Q = require('q');

module.exports = {
  /**
   * Queries the databsse for favors inside the given box
   * @method fetchFavors
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  fetchFavors: function(req, res, next) {
  	var box = req.body.box;
    var query = Favor.find(utils.getPolyBoxQuery(box));
    query.exec(function(err, docs) {
      res.json(docs);
      if (err) {
        res.send('ERROR in Favor.find ' + err)
      }
    });
  },
  
  /**
   * This function adds favors to the database.
   * @method createFavor
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  createFavor: function(req, res, next) {
    var favor = new Favor({
      topic: req.body.topic,
      description: req.body.description,
      place_name: req.body.place_name,
      address: req.body.address,
      user_id: req.user.provider_id,
      photos: [],
      icon: req.body.icon,
      loc: {
        "coordinates": [req.body.location.F, req.body.location.A]
      },
      votes: 0,
      isPrivate: false
    });
    favor.save(function(err, favor) {
      if (err) console.log('ERROR in favor creation: ', err);
      if (err) {
        throw err;
      } else {
        Notifier.notifyNewFavor(favor);
      }
      //done(null, user);
      res.send(favor);
    });
  },

  /**
   * This function grabs favors for a specific user. Used for profile page
   * @method grabFavor
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  grabFavor: function(req, res, next) {
    Favor.find(
      {user_id : req.user.provider_id},  
      function(err, data){
        res.json(data);
    });
  }
}
