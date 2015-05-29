var  FacebookTokenStrategy = require('passport-facebook-token');
//var request = require("request");
var configAuth = require('./AuthConfig.js');
var User = require('../db/userModel.js');


/**
 * Passport configuration
 * @method exports
 * @param {} passport
 */
module.exports = function(passport) {

  passport.use( new FacebookTokenStrategy({
  //set clientID and clientSecret (from facebook app settings)
  clientID : process.env.ClientID || configAuth.facebookAuth.clientID,
  clientSecret : process.env.ClientSecret || configAuth.facebookAuth.clientSecret
  }, function(accessToken, refereshToken, profile, done) {
    console.log("WE ARE INSIDE THE NEW FB ", profile)
    
    //create dummy user
    var user = new User({ name: 'Test User',
                          screen_name: 'test',
                          provider: 'facebook',
                          provider_id: 413
                        });

    user.save(function (err) {
      if (err) {
        console.log('error!');
      }
      
      User.findById(user, function(err, newUser) {
        if (err) {
          console.log('error!');
        }

        return done(err, newUser);
      });

    //TODO: find/create user in db
    // attaches user to req (use this in controllers)
    });

  }));


}

