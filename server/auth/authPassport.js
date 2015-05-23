var User = require('../db/userModel.js');
var FacebookStrategy = require('passport-facebook').Strategy;

// API keys configuration file
var config = require('./AuthConfig');

var authenticated = function (req) {
  return req.session && req.session.passport && req.session.passport.user;
}

/**
 * Authenticates requests.
 *
 * Applies the Facebook authentication strategy to the incoming request
 * If authentication is successful the user will be logged in
 * and populated at `req.session.passport` and a session will be
 * established.  
 *
 * @api public
 */
module.exports = {
  /**
   * Initializes the FacebookStrategy to create a user object if needed
   * on successful authentication
   * 
   * @param {Passport} passport authentication 
   * @api public
   */
  init: function (passport) {

    // Serialize the user for storing it in the session
    passport.serializeUser(function (user, done) {
      // console.log('serializeUser ', user);
      done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
      // console.log('deserializeUser ', obj);
      done(null, obj);
    });

    passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: '/auth/facebook/callback'
    }, function (accessToken, refreshToken, profile, done) {
      User.findOne({
        provider_id: profile.id
      }, function (err, user) {
        // console.log('ERROR in finding user on login: ', err);
        if (err) throw (err);
        // console.log('LOGIN no error, user: ', user);
        if (!err && user != null) return done(null, user);

        var user = new User({
          // provider_id: profile.id,
          // provider: profile.provider,
          // name: profile.displayName,
          // screen_name: profile.username,
          // photo: profile.photos[0].value
        });
        user.save(function (err) {
          if (err) console.log('ERROR in user creation on login: ', err);
          if (err) throw err;
          done(null, user);
        });
      });
    }));

  },

  /**
   * For authenticating api calls, returns 401 if not authenticated
   *  
   * @api public
   */
  authenticate: function (req, res, next) {
    if (authenticated(req)) {
      return next();
    } else {
      return res.send(401);
    }
  },

  /**
   * For protecting static assets, redirects to /signin.html
   *  
   * @api public
   */
  signInIfNotAuthenticated: function (req, res, next) {
    if (authenticated(req)) {
      next();
    } else {
      res.redirect('/signin.html')
    }
  }

};