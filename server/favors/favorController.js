var Favor = require('../db/favorModel.js');
var Photo = require('../db/photoModel.js');
var Notifier = require('../push/pushNotify.js');
var Q = require('q');

var getPolyBoxQuery = function(box) {
  console.log("I AM INSIDE THE BOX!!!!!");
  var polyBox = [  // sw, ne
    [
      [box[0][0], box[0][1]],
      [box[1][0], box[0][1]],
      [box[1][0], box[1][1]],
      [box[0][0], box[1][1]],
      [box[0][0], box[0][1]]
    ]
  ];
  return {
    "loc": {
      "$geoWithin": {
        "$geometry": {
          "type": "Polygon",
          "coordinates": polyBox
        }
      }
    }
  }
};

module.exports = {
  getPolyBoxQuery: getPolyBoxQuery,

  fetchFavors: function(req, res, next) {
    console.log("I AM INSIDE OF fetchFavors!!!");
  	var box = req.body.box;
    var query = Favor.find(getPolyBoxQuery(box));
    query.exec(function(err, docs) {
      res.json(docs);
      if (err) {
        console.log('ERROR in Favor.find ', err)
        res.send('ERROR in Favor.find ' + err)
      }
    });
  },
  
  createFavor: function(req, res, next) {
    console.log("IM INSIDE CREATE FAVOR "+JSON.stringify(req.body));
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
  updateFavor: function(req, res, next) {
    // var userObj = req.session.passport.user;
    // var create, newPortfolio;
    res.send('updateFavor called with body: ' + JSON.stringify(req.body));
  },

  upVoteFavor: function(req, res, next) {
  
    Favor.findByIdAndUpdate(req.body._id, 
      {votes: req.body.votes+1 }, 
      function(err, data){
      res.send('successfully upvoted');
    });

  },

  downVoteFavor: function(req, res, next) {
    // var userObj = req.session.passport.user;
    // var create, newPortfolio;

    Favor.findByIdAndUpdate(req.body._id, 
      {votes: req.body.votes-1 }, 
      function(err, data){
      res.send('successfully downvoted');
    });
  },

  grabFavor: function(req, res, next) {
    console.log("I'M INSIDE GRAB FAVOR!!!"+req.user)
    Favor.find(
      {user_id : req.user.provider_id},  
      function(err, data){
        res.json(data);
    });
  }
}
