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
  clientID : process.env.ClientID || configAuth.facebook.clientID,
  clientSecret : process.env.ClientSecret || configAuth.facebook.clientSecret
  }, function(accessToken, refereshToken, profile, done) {
    console.log("WE ARE INSIDE THE NEW FB ", profile)
    
    //Look for user inside the Mongo database by profile id
    User.findOne( { provider_id: profile.id },
      function(err, user) {
        //If not found
        if(!user) {
          //Create user
          var user = new User({ name: profile.displayName,
                          provider: profile.provider,
                          provider_id: profile.id
                        });
          //Save the user
          user.save(function (err) {
            if (err) {
              console.log('error!');
            }
      
            return done(err, user);
          });
        } else { return done(err, user); }

      });

  }));
}

