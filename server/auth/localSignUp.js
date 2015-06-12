var User = require('../db/userModel.js');
var LocalStrategy  = require('passport-local').Strategy;

/**
 * Description
 * @method authenticated
 * @param {} req
 * @return LogicalExpression
 */
var authenticated = function (req) {
  return req.session && req.session.passport && req.session.passport.user;
}


module.exports = {

  /**
   * Description
   * @method init
   * @param {} passport
   * @return 
   */
  init: function(passport) {

    console.log("I'm inside!")

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = req.body.email;
                newUser.local.password = newUser.generateHash(req.body.password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

},

  /**
   * For authenticating api calls, returns 401 if not authenticated
   *  
   * @api public
   * @method authenticate
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  authenticate: function (req, res, next) {
    if (authenticated(req)) {
      return next();
    } else {
      return res.sendStatus(401);
    }
  },

  /**
   * For protecting static assets, redirects to /signin.html
   *  
   * @api public
   * @method signInIfNotAuthenticated
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  signInIfNotAuthenticated: function (req, res, next) {
    if (authenticated(req)) {
      next();
    } else {
      res.redirect('/signin.html')
    }
  }

};