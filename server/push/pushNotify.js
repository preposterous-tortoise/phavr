var favorController = require('../favors/favorController.js');
var Favor = require('../db/favorModel.js');
var User = require('../db/userModel.js');
var request = require('request');
var Q = require('q');


var sendMessage = function(users, message) {
  var data = {
    users: users,
    android: {
      data: {
        message: message
      }
    }
  };
  console.log('data to be send to phavr-push: ', data);
  request.post({
      url: 'http://phavr-push.herokuapp.com/send',
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
          var favor = favors[0];
          var query = User.findOne({
            provider_id: favor.user_id
          });
          query.exec(function(err, user) {
            if (err) {
              console.log('Error finding user by id:', err);
            } else {
              console.log('found user for notifyNewPhoto', JSON.stringify(user, null, '\t'));
              if (user && user.notify_photos) {
                console.log('New Photo for favor: ', favor_id, favors);
                var message = "A photo was taken for your favor \"" + favor.description + "\" at " + favor.place_name;
                message += ", " + new Date();
                console.log('message: ', message);
                sendMessage([favor.user_id], message);
              }
            }
          });
        }
      });
  },

  notifyNewFavor: function(favor) {
    console.log("notifyNewFavor: ", favor);
    console.log('new favor box: ', getBoxForLoc(favor.loc.coordinates));
    var box = getBoxForLoc(favor.loc.coordinates);
    var query = User.find(getPolyBoxQuery(box));
    query.exec(function(err, users) {
      console.log("notifyNewFavor, nearby user count: ", users ? users.length : 0);
      console.log("favor user id: ", favor.user_id);
      if (err) {
        console.log('Error finding users for box:', box, err);
      } else {
        var message = 'There is a new favor requested near you at ' + favor.place_name + ', ' + favor.address;
        message += ", " + new Date();
        var usersToNofify = [];
        users.forEach(function(user) {
          console.log('new favor, nearby user: ', user.name, ', notify_favors: ', user.notify_favors );
          console.log('ids: ', user.provider_id != favor.user_id, user.provider_id, favor.user_id);
          if ((user.provider_id != favor.user_id) && user.notify_favors)
            usersToNofify.push(user.provider_id);
        });
        console.log('users to notify for new favor: ', usersToNofify.length);
        if (usersToNofify.length > 0) {
          sendMessage(usersToNofify, message);
        }
      }
    });
  }

}