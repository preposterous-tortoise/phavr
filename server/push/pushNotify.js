var Favor = require('../db/favorModel.js');
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
  }

}