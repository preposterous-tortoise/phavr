var favorController = require('../favors/favorController.js');
var Favor = require('../db/favorModel.js');
var User = require('../db/userModel.js');
var request = require('request');
var Q = require('q');


var sendMessage = function(user_profile_id, message) {
  console.log('sending message to frank-push for id: ', user_profile_id);
  var data = {
    //users: [user_profile_id],
    users: [user_profile_id],
    android: {
      data: {
        message: message
      }
    }
  };
  console.log('data to be send to frank-push: ', data);
  request.post({
      url: 'http://frank-push.herokuapp.com/send',
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: data
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('response from node-pushserver: ', response.statusCode, body);
      } else {
        console.log('Error response from node-pushserver: ', error, response.statusCode, body);
      }
    }
  );
}

var getBoxForLoc = function(coords /* [lng, lat] */) {
  var miles = 1;
  var radius = 0.02899*miles;
  var box = [[coords[0]-radius, coords[1]-radius], //sw
            [coords[0]+radius, coords[1]+radius]]; //ne
  return box;
}

var getPolyBoxQuery = function(box) {
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

  notifyNewPhoto: function(favor_id) {
    Favor.find({
        _id: favor_id
      },
      function(err, favors) {
        if (err) {
          console.log('Error fetching favor for notification: ', err, favors);
        } else {
          console.log('New Photo for favor: ', favor_id, favors);
          // A photo was taken for your favor "description" at PLACE_NAME
          // 
          var favor = favors[0];
          var message = "A photo was taken for your favor \"" + favor.description + "\" at " + favor.place_name;
          console.log('message: ', message);
          sendMessage(favor.user_id, message);
        }
      });
  },

  notifyNewFavor: function(favor) {
    // console.log("notifyNewFavor: ", favor);
    // console.log('new favor box: ', getBoxForLoc(favor.loc.coordinates));
    var box = getBoxForLoc(favor.loc.coordinates);
    var query = User.find(getPolyBoxQuery(box));
    query.exec(function(err, users) {
      if (err) {
        console.log('Error finding users for box:', box, err);
      } else {
        var message = 'There is a new favor requested near you at ' + favor.place_name + ', ' + favor.address;
        users.forEach(function(user) {
          sendMessage(user.provider_id, message);
        });
        console.log('Users for box: ', users);
      }
    });
  }

}