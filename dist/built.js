module.exports = {
 twitter: {
   key: '',
   secret: ''
 },
 facebook: {
   "clientID": "1443792965917018",
   "clientSecret": "7650cb7ec94fe197901a90d00d7da8c5",
   "callbackURL": "http://localhost:3000/auth/facebook/callback"

 }
};
//add this;var User = require('../db/userModel.js');
var FacebookStrategy = require('passport-facebook').Strategy;

// API keys configuration file
var config = require('./AuthConfig');

/**
 * Description
 * @method authenticated
 * @param {} req
 * @return LogicalExpression
 */
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
   * @api public
   * @method init
   * @param {Passport} passport authentication 
   * @return 
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

      // console.log("THIS iS THE PROFILE "+JSON.stringify(profile));
      // console.log("THIS IS PROFILE URL "+profile.profileUrl);
      User.findOne({
        provider_id: profile.id
      }, function (err, user) {
        // console.log('ERROR in finding user on login: ', err);
        if (err) throw (err);
        // console.log('LOGIN no error, user: ', user);

        if (!err && user != null) {
          return done(null, user);
        }

        console.log("Please don't break! "+JSON.stringify(profile));
        var user = new User({
          provider_id: profile.id,
          provider: profile.provider,
          name: profile.displayName,
          photo: profile.profileUrl
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

};;var User = require('../db/userModel.js');
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

};;var  FacebookTokenStrategy = require('passport-facebook-token');
//var request = require("request");
var configAuth = require('./AuthConfig.js');
var User = require('../db/userModel.js');


/**
 * Passport configuration
 * @method exports
 * @param {} passport
 * @return 
 */
module.exports = function(passport) {

  passport.use( new FacebookTokenStrategy({
  //set clientID and clientSecret (from facebook app settings)
  clientID : process.env.ClientID || configAuth.facebook.clientID,
  clientSecret : process.env.ClientSecret || configAuth.facebook.clientSecret
  }, function(accessToken, refereshToken, profile, done) {
    // console.log("WE ARE INSIDE THE NEW FB ", profile)
    
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

;//Different NPM Modules
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

//var request = require('request');
var multer  = require('multer');

//User Model Schema
var User = require('../db/userModel.js');


//Auth
var auth = require('../auth/authPassport');
var fbAuth = require('../auth/newAuthPassport')(passport);
 
/**
 * Core Middleware
 * Sets up top-level routes, authentication, and session initialization
 */

module.exports = function(app, express){
  // Passport initialization
  auth.init(passport);
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Passport Routes 
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.use(cookieParser('add a secret here'));
  app.use(session({ secret: 'xyz-qwrty', resave: false, saveUninitialized: true }));

  var photoRouter = express.Router();
  var favorRouter = express.Router();
  var voteRouter = express.Router();
  var userRouter = express.Router();

  //Used for logging request details
  app.use(morgan('dev'));

  //Allows the use of req.body
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  // app.get('/', auth.signInIfNotAuthenticated);
  app.use('/index.html', auth.signInIfNotAuthenticated);

  //Serve the static files from the Front-End
  app.use(express.static(path.join(__dirname,'/../../client/www')));

  //On every subsequent http request from the Front-End, it will attach these headers to the response
  app.use('/', function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, access_token");
    next();
  });

  //Routes from Front-End $http requests to their respective routers; authenticated
  app.use('/api/requests', passport.authenticate('facebook-token'), favorRouter);
  app.use('/api/photos', passport.authenticate('facebook-token'), photoRouter);
  app.use('/api/votes', passport.authenticate('facebook-token'), voteRouter);
  app.use('/api/users', passport.authenticate('facebook-token'), userRouter);

  // Used to grab user information from the user property of the request. 
  // Provides FB info for name and profile picture
  app.get('/api/profileID', passport.authenticate('facebook-token'), 
    function(req, res){
      res.send(req.user);
  });

  //Adding routes
  require('../favors/favorRoutes.js')(favorRouter);
  require('../photos/photoRoutes.js')(photoRouter);
  require('../votes/voteRoutes.js')(voteRouter);
  require('../users/userRoutes.js')(userRouter);



  //Setting up twitter and instagram scraping routes
  /*var twitterScrapeRouter = express.Router();
  app.use('/api/twitter', /*auth.athenticate*/ /*twitterScrapeRouter);
  require("../webScraping/twitterRoutes.js")(twitterScrapeRouter);*/

  /*var instagramScrapeRouter = express.Router();
  app.use('/api/instagram', /*auth.athenticate*/ /*instagramScrapeRouter);
  require("../webScraping/instagramRoutes.js")(instagramScrapeRouter);*/

  app.post('/auth/facebook/token',
    passport.authenticate('facebook-token'),
      function (req,res) {
        console.log('authorized user!');
        //console.log(req.user);
        res.send(req.user? 201 : 401)
      });

  //Multer is an NPM module used to upload multi-part data
  app.use(multer({ dest: './uploads/', 
    rename: function(fieldname, filename) {
              console.log(fieldname);
              console.log(filename);
              return filename;
            }
  }));

  //Used to chunk the photos into one coherent file before uploading them to S3
  app.post('/photoUploads/uploadToServer', function(req,res){
    console.log("_________________");
     console.log(req.files);
    res.redirect('/photoUploads/uploadToS3/?fileName=' + req.files.file.originalname);
  });
  
  //Sending photos to S3
  app.get('/photoUploads/uploadToS3/', function(req,res){

      console.log("THIS IS THE UPLOAD S3 BODY!"+JSON.stringify(req.body));

       var fmt = require('fmt');
       var amazonS3 = require('awssum-amazon-s3');
       var fs = require('fs');

       //Setting up access keys
       var s3 = new amazonS3.S3({
           'accessKeyId'     : process.env.AWS_ACCESS_KEY_DARREN,
           'secretAccessKey' : process.env.AWS_SECRET_KEY_DARREN,
           'region'          : "us-east-1"
       });

      console.log("^^^^^^^^^^^^^^^^");
       console.log(req.query.fileName);
       var fileName = req.query.fileName;
       var favorID = (fileName.split("___"))[1].slice(0,-4);
       console.log(favorID);



       // you must run fs.stat to get the file size for the content-length header (s3 requires this)
       fs.stat("./uploads/"+fileName, function(err, file_info) {
          console.log("{}{}{}{}{}{}{}{}{}{}}");
          console.log(req.files);
           var bodyStream = fs.createReadStream("./uploads/"+fileName);
           var options = {
               BucketName    : "darrendrakeapp",
               ObjectName    : fileName,
               ContentLength : file_info.size,
               Body          : bodyStream
           };

           //Actually sends data to S3
           s3.PutObject(options, function(err, data) {
             console.log("im in putobject function");


               fmt.dump(err, 'err');
               fmt.dump(data, 'data');
           });
       });


    console.log("_____________");
    res.send('upload complete');
  });
}

;var mongoose = require('mongoose');

/* favors/requests, created by users.
 * a user creates a request for a photo fitting the description, located in the specified area.
 * as users fulfill the request, photos are added to the request.
 * favors belong to a user.
 */

var FavorSchema = new mongoose.Schema({
  topic: String,
  description: String,
  user_id: Number,  // provider_id
  icon: String,
  place_name: String,
  address: String,
  loc: {
   'type': {type: String, enum: "Point", default: "Point"},
   'coordinates': { type: [Number],   default: [0,0]} 
  },
  votes: Number,
  isPrivate: Boolean,
  createdAt: { type: Date, expires: 86400, default: Date.now }
});

FavorSchema.index({loc: '2dsphere'});

module.exports = mongoose.model('favor', FavorSchema);

; var mongoose = require('mongoose');

/* photos taken by users to fulfill requests/favors.
 * photos are attached to a user and a request.
 */

var PhotoSchema = new mongoose.Schema({
  url: String,
  request_id: String,
  user_id: String,
  votes: { type: Number, default: 0 },
  loc: {
   'type': {type: String, enum: "Point", default: "Point"},
   'coordinates': { type: [Number],   default: [0,0]} 
  },
  createdAt: { type: Date, expires: 86400, default: Date.now },
  icon: String
});

PhotoSchema.index({loc: '2dsphere'});

module.exports = mongoose.model('photo', PhotoSchema);

;// Database user model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String, // user name
	notify_favors: Boolean, // push notify for new nearby favors
	notify_photos: Boolean, // push notify for photos for my favors
  screen_name : String,
	provider: String, // Twitter, Facebook, etc
	provider_id : {type: String, unique: true}, // id returned by Twitter, Facebook, etc.
	photo: String, // user's photo or avatar,
	points: Number,
	loc: {
   'type': {type: String, enum: "Point", default: "Point"},
   'coordinates': { type: [Number],   default: [0,0]} 
  },
	createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('users', UserSchema);
;var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VoteSchema = new Schema({
  userID: String, // userID
  favorID: String, //favorID
  photoID: String,
  vote: Number, // 0(Neutral), 1(upvote), -1(downvote)
});

module.exports = mongoose.model('votes', VoteSchema);;var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VotePhotoSchema = new Schema({
	userID: String, // userID
  photoID: String, //favorID
	vote: Number, // 0(Neutral), 1(upvote), -1(downvote)
});

module.exports = mongoose.model('votePhotos', VotePhotoSchema);;var Favor = require('../db/favorModel.js');
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
;var favorController = require('./favorController.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function (app) {
  app.route('/')
    .post(favorController.fetchFavors);

  app.route('/create')
    .post(favorController.createFavor);

  // app.route('/update')
  //   .post(favorController.updateFavor);

  // app.route('/upVote')
  //   .post(favorController.upVoteFavor);

  // app.route('/downVote')
  //   .post(favorController.downVoteFavor);

  app.route('/grabFavor')
    .post(favorController.grabFavor);
};;var Photo = require('../db/photoModel.js');
var Notifier = require('../push/pushNotify.js');
// var Q = require('q');
var aws = require('aws-sdk');
var uuid = require('uuid');
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

module.exports = {
  /**
   * Creates a new photo entry in the Photo table
   * @method createPhoto
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  createPhoto: function(req, res, next) {
    //Create a new Photo and Save it
    var photo = new Photo({ url: req.body.image, 
                            request_id: req.body.favor_id,
                            user_id: req.user.provider_id
                                });
          photo.save(function (err) {
            if(err) { console.log(err); }
            // A photo was taken for your favor "description" at PLACE_NAME
            // need to fetch favor from database
            // notification.newPhoto send 
            Notifier.notifyNewPhoto(req.body.favor_id);
            res.status(201).send('Photo saved at https://drakeapp-photos.s3.amazonaws.com/.jpg');
          });
  },

  /**
   * Creates a new dummy photo for testing purposes
   * @method createDummyPhoto
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  createDummyPhoto: function(req, res, next) {
    var photo = new Photo({ url: req.body.url, 
                            request_id: req.body.favor_id
                          });
    photo.save(function (err, photo) {
      if(err) { console.log(err); }
      res.status(201).send(photo);
    });

  },

  /**
   * Query the Photo table for a photos from a certain favor
   * @method fetchPhotosForFavor
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  fetchPhotosForFavor: function(req, res, next) {
    var query = Photo.find({
      request_id: req.body.favor_id
    });
    query.exec(function(err, docs) {
      res.json(docs);
      if (err) {
        res.send('ERROR in fetchPhotosForFavor ' + err)
      }
    });
  },

  /**
   * This function uploads the chunkified picture to the Amazon S3 service
   * @method uploadToS3
   * @param {} req
   * @param {} res
   * @return 
   */
  uploadToS3: function(req,res){

      console.log("THIS IS THE UPLOAD S3 BODY!"+JSON.stringify(req.body));

       var fmt = require('fmt');
       var amazonS3 = require('awssum-amazon-s3');
       var fs = require('fs');

       //Setting up access keys
       var s3 = new amazonS3.S3({
           'accessKeyId'     : process.env.AWS_ACCESS_KEY_DARREN,
           'secretAccessKey' : process.env.AWS_SECRET_KEY_DARREN,
           'region'          : "us-east-1"
       });

      console.log("^^^^^^^^^^^^^^^^");
       console.log(req.query.fileName);
       var fileName = req.query.fileName;
       var favorID = (fileName.split("___"))[1].slice(0,-4);
       console.log(favorID);



       // you must run fs.stat to get the file size for the content-length header (s3 requires this)
       fs.stat("./uploads/"+fileName, function(err, file_info) {
          console.log("{}{}{}{}{}{}{}{}{}{}}");
          console.log(req.files);
           var bodyStream = fs.createReadStream("./uploads/"+fileName);
           var options = {
               BucketName    : "darrendrakeapp",
               ObjectName    : fileName,
               ContentLength : file_info.size,
               Body          : bodyStream
           };

           //Actually sends data to S3
           s3.PutObject(options, function(err, data) {
             console.log("im in putobject function");


               fmt.dump(err, 'err');
               fmt.dump(data, 'data');
           });
       });


    console.log("_____________");
    res.send('upload complete');
  },

  /**
   * This function is used to make sure the photo is completely chunkified before its sent of to the S3 servers
   * @method uploadToServer
   * @param {} req
   * @param {} res
   * @return 
   */
  uploadToServer: function(req,res){
    console.log("_________________");
     console.log(req.files);
    res.redirect('api/photos/uploadToS3?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU' + req.files.file.originalname);
  }
}
;var photoController = require('./photoController.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function (app) {
  console.log('photo router');
  app.route('/create')
    .post(photoController.createPhoto);

  app.route('/create-dummy')
    .post(photoController.createDummyPhoto);

  app.route('/fetch')
    .post(photoController.fetchPhotosForFavor);

  // app.route('/update')
  //   .post(photoController.updatePhoto);

  // app.route('/upVote')
  //   .post(photoController.upVotePhoto);

  // app.route('/downVote')
  //   .post(photoController.downVotePhoto);

  app.route('/uploadToS3')
    .get(photoController.uploadToS3);

  app.route('/uploadToServer')
    .post(photoController.uploadToServer);
};
;var favorController = require('../favors/favorController.js');
var Favor = require('../db/favorModel.js');
var User = require('../db/userModel.js');
var utils = require('../utils/utils.js');
var request = require('request');

/**
 * Description: send a message to the push server
 * @method sendMessage
 * @param {Array} users - the provider ids of the recipients
 * @param {String} message
 * @return 
 */
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

module.exports = {

  /**
   * Tells the user that there is a new photo in their favor's thread
   * @method notifyNewPhoto
   * @param {} favor_id
   * @return 
   */
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
                message += ", " + new Date().toLocaleString();
                console.log('message: ', message);
                sendMessage([favor.user_id], message);
              }
            }
          });
        }
      });
  },

  /**
   * Tell's the user that they have entered the vicinity of a new favor
   * @method notifyNewFavor
   * @param {FavorSchema} favor
   * @return 
   */
  notifyNewFavor: function(favor) {
    console.log("notifyNewFavor: ", favor);
    console.log('utils: ', JSON.stringify(utils, null, '\t'));
    console.log('new favor box: ', utils.getBoxForLoc(favor.loc.coordinates));
    var box = utils.getBoxForLoc(favor.loc.coordinates);
    var query = User.find(utils.getPolyBoxQuery(box));
    query.exec(function(err, users) {
      console.log("notifyNewFavor, nearby user count: ", users ? users.length : 0);
      console.log("favor user id: ", favor.user_id);
      if (err) {
        console.log('Error finding users for box:', box, err);
      } else {
        var message = 'There is a new favor requested near you at ' + favor.place_name + ', ' + favor.address;
        message += ", " + new Date().toLocaleString();
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

};

var express = require('express')
var app = express();
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var db_port = process.env.MONGOLAB_URI || 'mongodb://localhost/drakeapp';

mongoose.connect(db_port);
require('./config/middleware.js')(app, express);
app.listen(port);
console.log("Now listening on port", port);;var drakeapp = require("../server.js");
var request = require('request');
var frisby = require("frisby");

//test might fail due to expired token, check on that.

var favorr

describe("Authentication!", function () {

	frisby.create('Authentication')
	  .post("http://localhost:3000/auth/facebook/token?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU")
	  .expectStatus(201)
	.toss();
  
}); 

describe("Location!", function () {

	frisby.create('Location')
	  .post("http://localhost:3000/location?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU")
	  .expectStatus(404)
	.toss();
  
});

describe("Create A Favor!", function () {

	frisby.create('Make A Favor')
	  .post("http://localhost:3000/api/requests/create?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	    {"topic":"lol4", "tags": "lol4", "description":"lol4","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","icon":"http://frit-talk.com/mobile/2/endirect.png","location":{"A": 37.783724, "F": -122.40897799999999}}
	  	)
	  .expectStatus(200)
	  .expectHeader('Content-Type', 'application/json; charset=utf-8')
	  .afterJSON(function (body) {
	          console.log("THIS IS INSIDE BODY DOG! "+JSON.stringify(body));
	          favorr = JSON.stringify(body);
	        })
	.toss();
  
});

describe("Testing an upVote", function () {

	frisby.create('Make A Favor')
	  .post("http://localhost:3000/api/requests/create?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	    {"topic":"lol4", "tags": "lol4", "description":"lol4","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","icon":"http://frit-talk.com/mobile/2/endirect.png","location":{"A": 37.783724, "F": -122.40897799999999}}
	  	)
	  .expectStatus(200)
	  .expectHeader('Content-Type', 'application/json; charset=utf-8')
	  .afterJSON(function (body) {
	  		frisby.create('Upvote')
	  		  .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  		  	{ favor: {"_id": body._id}, vote: 1 }
	  		  	)
	  		  .expectStatus(200)
	  		  .expectHeader('Content-Type', 'text/html; charset=utf-8')
	  		  .afterJSON(function (body) {
	  		          //changed values
	  		          expect(body).toMatch(1);
	  		        })
	  		.toss();
	          
	        })
	.toss();

	// frisby.create('Upvote')
	//   .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	//   	{ favor: {"_id":"556ca405e30393ac1cc6148f","topic":"yo","description":"yo","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","user_id":1,"icon":"http://frit-talk.com/mobile/2/endirect.png","votes":0,"isPrivate":false,"__v":0,"createdAt":"2015-06-01T18:27:17.510Z","loc":{"coordinates":[-122.40897799999999,37.783724],"type":"Point"},"$$hashKey":"object:14"}, vote: 1 }
	//   	)
	//   .expectStatus(200)
	//   .expectHeader('Content-Type', 'text/html; charset=utf-8')
	//   .afterJSON(function (body) {
	//           //changed values
	//           expect(body).toMatch(0);
	//         })
	// .toss();
  
});

describe("Testing a downVote", function () {

	// frisby.create('downVote')
	//   .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	//   	{ favor: {"_id":"556ca405e30393ac1cc6148f","topic":"yo","description":"yo","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","user_id":1,"icon":"http://frit-talk.com/mobile/2/endirect.png","votes":0,"isPrivate":false,"__v":0,"createdAt":"2015-06-01T18:27:17.510Z","loc":{"coordinates":[-122.40897799999999,37.783724],"type":"Point"},"$$hashKey":"object:14"}, vote: -1 }
	//   	)
	//   .expectStatus(200)
	//   .expectHeader('Content-Type', 'text/html; charset=utf-8')
	//   .afterJSON(function (body) {
	//           //changed values
	//           expect(body).toMatch(0);
	//         })
	// .toss();

	frisby.create('Make A Favor')
	  .post("http://localhost:3000/api/requests/create?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	    {"topic":"lol4", "tags": "lol4", "description":"lol4","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","icon":"http://frit-talk.com/mobile/2/endirect.png","location":{"A": 37.783724, "F": -122.40897799999999}}
	  	)
	  .expectStatus(200)
	  .expectHeader('Content-Type', 'application/json; charset=utf-8')
	  .afterJSON(function (body) {
	  		frisby.create('Downvote')
	  		  .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  		  	{ favor: {"_id": body._id}, vote: -1 }
	  		  	)
	  		  .expectStatus(200)
	  		  .expectHeader('Content-Type', 'text/html; charset=utf-8')
	  		  .afterJSON(function (body) {
	  		          //changed values
	  		          expect(body).toMatch(-1);
	  		        })
	  		.toss();
	          
	        })
	.toss();
  
});

describe("Testing Photo", function () {

	frisby.create('Dummy Photo')
	  .post("http://localhost:3000/api/photos/create-dummy?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  	{"favor_id":"556ca405e30393ac1cc6148f", "url":"www/example.com"}
	  	)
	  .expectStatus(201)
	  .afterJSON(function (body) {
	          //changed values
	          console.log("THIS IS FOR DUMMY PHOTO!!!! "+JSON.stringify(body));
	        })
	.toss();
  
});

describe("Photo Upload", function () {

	frisby.create('Dummy Photo')
	  .get("http://localhost:3000/photoUploads/uploadToS3/",
	  	{ query:{"fileName":"yoyo.jpg"}}
	  	)
	  .expectStatus(500)
	.toss();
  
});

describe("Testing a downVote Photo", function () {

	frisby.create('Dummy Photo')
	  .post("http://localhost:3000/api/photos/create-dummy?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  	{"favor_id":"556ca405e30393ac1cc6148f", "url":"www/example.com"}
	  	)
	  .expectStatus(201)
	  .afterJSON(function (body) {
	  		frisby.create('Downvote')
	  		  .post("http://localhost:3000/api/votes/upVotePhoto?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  		  	{ photo: {"_id": body._id}, vote: -1 }
	  		  	)
	  		  .expectStatus(200)
	  		  .afterJSON(function (body) {
	  		          //changed values
	  		          expect(body).toMatch(-1);
	  		        })
	  		.toss();
	          
	        })
	.toss();
  
});

describe("Testing an UpVote Photo", function () {

	frisby.create('Dummy Photo')
	  .post("http://localhost:3000/api/photos/create-dummy?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  	{"favor_id":"556ca405e30393ac1cc6148f", "url":"www/example.com"}
	  	)
	  .expectStatus(201)
	  .afterJSON(function (body) {
	  		frisby.create('Downvote')
	  		  .post("http://localhost:3000/api/votes/upVotePhoto?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  		  	{ photo: {"_id": body._id}, vote: 1 }
	  		  	)
	  		  .expectStatus(200)
	  		  .afterJSON(function (body) {
	  		          //changed values
	  		          expect(body).toMatch(1);
	  		        })
	  		.toss();
	          
	        })
	.toss();
  
});





;
	var topK = {};

	var makeNode = function(votes) {
		this.votes = votes || 0;
	}

	var BinaryHeap = function(propertyToCompare, arr, k) {
		this.content = [null]

		this.propertyToCompare = propertyToCompare;
		this.k = k;
		if(arr) arr.forEach(this.insert.bind(this));

		this.getVal = function(i) {
			return this.content[i][propertyToCompare];
		}

	}

	//
	BinaryHeap.prototype = {

		/**
		* API methods
		*/
		isFull: function(){
			return this.content.length > this.k  ? true : false;
		},

		isEmpty: function() {
			return this.content.length === 1 ? true : false;
		},

		peak: function(object) {
			return this.content[1];
		},

		insert: function(object) {


			if(!this.isFull()) {

				//insert into min heap, and bubble to correct position
				topK[object.favorID] = this.content.length;
				this.bubble(this.content.push(object)-1);
			}
		},


		remove: function() {

			if(!this.isEmpty()){


				var minObject = this.content[1];
				if(this.content.length === 2) {
					this.content.pop();
				} else {
					this.content[1] = this.content.pop();
					this.sink(1);
				}

				return minObject;
				
			}
		},

		/**
		*auxiliary methods
		*/

		bubble: function(i) {
			var parentIndex = Math.floor(i/2);

			if(i>1 &&this.content[parentIndex][this.propertyToCompare] > this.content[i][this.propertyToCompare]) {
				this.swap(i, parentIndex);
				this.bubble(parentIndex);
			}

		},

		sink: function(i) {
			var childIndex;
			var isLeftLesser;
			if( this.content[i*2] === undefined && this.content[i*2+1]=== undefined ){
				return;

			}else if( this.content[i*2] === undefined){
				isLeftLesser = false;
			}else if( this.content[i*2+1] === undefined) {
				isLeftLesser = true;
			}else {
				//both child exists
				isLeftLesser = this.content[i*2][this.propertyToCompare] < this.content[i*2+1][this.propertyToCompare];
			}
			
			childIndex = isLeftLesser ? i*2: i*2+1;
			if(this.content[childIndex][this.propertyToCompare]< this.content[i][this.propertyToCompare]){
				this.swap(i, childIndex);
				this.sink(i);
			}
		},
    	
    	swap: function(i,j) {
        	if (j< 0) j += this.content.length; 


        	//update hashtable with new indexes
        	topK[this.content[i]["favorID"]] = j;
        	topK[this.content[j]["favorID"]] = i;


        	var temp = this.content[i];
        	this.content[i] = this.content[j];
        	this.content[j] = temp;

    	}


	}



	/**
	*	Look at element in data stream
	*/
		var h = new BinaryHeap("count",[],3);
		var decrementCounter = 0;

	var processNew = function(favorID) {

		//check whether favor is already in top K
		if(topK[favorID]) {
			//if already in topK, increment it
			h.content[topK[favorID]].count++;
			h.sink(topK[favorID]);
		}else {

			if(h.isFull()){
				//if full, decrement everything
				decrementCounter--;
				var minElement= h.peak();

				while( minElement && minElement.count + decrementCounter <=0 ) {
					h.remove();
					delete topK[minElement.favorID];
					minElement  = h.peak();
				}
				
			} else {
				h.insert({favorID:favorID, count:1 - decrementCounter});
			}

		}

		
	};

	processNew('a');
	processNew('b');
	processNew('c');
	processNew('c');
	processNew('a');

	console.log(h.content);
	console.log(topK);

	processNew('d');
		processNew('d');
		processNew('e')


	console.log(h.content);
	console.log(topK);
	processNew('d');
		processNew('d');
		processNew('e');

processNew('d');
		processNew('d');
		processNew('e');processNew('d');
		processNew('d');

	console.log(h.content);
	console.log(topK);

/**
* Now figure out whether the frequencies are accurate
* auto time expiry nodes 
*/

// var heap = new BinaryHeap("",[1],3);
// heap.remove();

// heap.remove();
// heap.insert(1);
// heap.insert(2);
// heap.remove();
// heap.insert(2);

// heap.remove();
// heap.remove();

// console.log(heap.content);

;var User = require('../db/userModel.js');
var Q = require('q');

module.exports = {
  /**
   * Update the user's location coordinates in their table
   * @method updateLocation
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @return 
   */
  updateLocation: function(req, res, next) {
    User.findOne({
      provider_id: req.user.provider_id,
    }, function(err, user) {
      if (err) {
        console.log('Error updating location for user: ', user);
        res.send('Error fetching user for update' + err);
      } else {
        console.log('fetched user for update: ', user);
        user.loc.coordinates = [req.body.lng, req.body.lat];
        user.save(function(err) {
          if (err) {
            console.log('errror updating user', err);
            res.send('Error updating user' + err);
          } else {
            console.log('Successfully updated user');
            res.send('Successfully updated user');
          }
        });
      }
    });
  },
  /**
   * Update the user's location coordinates in their table
   * @method update
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @return 
   */
  update: function(req, res, next) {
    console.log('updateLocation: ', req.body);
    User.findOne({
      provider_id: req.user.provider_id,
    }, function(err, user) {
      if (err) {
        console.log('Error updating location for user: ', user);
        res.send('Error fetching user for update' + err);
      } else {
        console.log('fetched user for update: ', user);
        if (req.body.notify_favors !== undefined) {
          user.notify_favors = req.body.notify_favors;
          user.notify_photos = req.body.notify_photos;
          req.user.notify_photos = user.notify_photos;
          req.user.notify_favors = user.notify_favors;
        }
        if (req.body.lng !== undefined) {
          user.loc.coordinates = [req.body.lng, req.body.lat];
        }
        user.save(function(err) {
          if (err) {
            console.log('errror updating user', err);
            res.send('Error updating user' + err);
          } else {
            console.log('Successfully updated user');
            res.send('Successfully updated user');
          }
        });
      }
    });
  }
};
;var userController = require('./userController.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function (app) {

	app.use('/', function(req,res, next){
    if (req.body.location) {
      req.body.lng = req.body.location.longitude;
      req.body.lat = req.body.location.latitude;
      req.body.timeStamp = req.body.location.recorded_at;
    }
    next();
  	});

  app.route('/updateloc')
    .post(userController.updateLocation);
   app.route('/update')
    .post(userController.update);
};

;/**
 * Description: given a lng/lat point returns the bounding box for a 1-mile radius
 * @method getBoxForLoc
 * @param {Array[lng, lat]} coords
 * @return {Array} box
 */
var getBoxForLoc = function(coords) {
  var miles = 1;
  var radius = 0.02899 * miles;
  var box = [
    [coords[0] - radius, coords[1] - radius], //sw
    [coords[0] + radius, coords[1] + radius]
  ]; //ne
  return box;
};

/**
 * Description: return a polygon box for sw/ne coordinates
 * @method getPolyBoxQuery
 * @param {Array[sw,ne]} box
 * @return ObjectExpression
 */
var getPolyBoxQuery = function(box) {
  var polyBox = [ // sw, ne
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
  getBoxForLoc: getBoxForLoc,
  getPolyBoxQuery: getPolyBoxQuery
};;var Favor = require('../db/favorModel.js');
var Photo = require('../db/photoModel.js');
var User = require('../db/userModel.js');

var Q = require('q');
var Vote = require('../db/voteModel.js');

module.exports = {
  /**
   * Function does both upvoting and downvoting
   * @method upVote
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  upVote: function(req, res, next) {


    //Query the Vote table for entries with a certain userID and favorID
    Vote.findOne({
      userID: req.user.provider_id,
      favorID: req.body.favor._id
    }, function (err, vote) {
      
      console.log("favorID", req.body.favor._id);
      console.log("THIS IS USER VOTE! "+vote);
      console.log(err);
      
      // console.log('ERROR in finding user on login: ', err);
      if (err) throw (err);

      // console.log('LOGIN no error, user: ', user);
      
      // check if there's already a vote by this user...
      if (!err && vote != null) {
        console.log('you already voted on that...'); 
        console.log("req.body.vote", req.body.vote);
        console.log("vote.vote", vote.vote);

        //If req.body.vote = 1, upvote; 0, nuetral; -1, downvote
        //If sending an upvote, check if there is already a downvote
        if (req.body.vote === 1 && (vote.vote ===-1 || vote.vote ===0))  { 
            //Increase the votes by 1 in both the votes and favors tables
            Vote.findByIdAndUpdate(vote._id,
              { $inc: {vote: 1 } },
              function(err, data) {
                console.log('succesfully did findbyidandupdate');
                Favor.findByIdAndUpdate(req.body.favor._id, 
                { $inc: {votes: 1 } }, 
                function(err, data){
                  User.findByIdAndUpdate(req.user._id,
                    { $inc: {points: 1 } },
                    function(err, data) {
                      console.log('succesfully did points!!!!!!!!!!!!!');
                      res.send('1');
                    });
                  // console.log("AWWWW im in callback")
                });
              });


        }

        else if(req.body.vote === -1 && (vote.vote === 1|| vote.vote ===0)){

            //Decrease a specific entry in both the favor and vote table by 1
            Vote.findByIdAndUpdate(vote._id,
              { $inc: {vote: -1 } },
              function(err, data) {
                  Favor.findByIdAndUpdate(req.body.favor._id, 
                  { $inc: {votes: -1 } }, 
                    function(err, data){
                        if (data.votes <= -4) {
                          data.remove()
                        } else if (data.votes > -5){
                          User.findByIdAndUpdate(req.user._id,
                            { $inc: {points: -1 } },
                            function(err, data) {
                              res.send('-1');
                            });
                        }
                  });
              });
          
        } else { 
          res.send('0'); 
        }
        // //otherwise, you've already voted. send back 0
      } else {
      
      //Create a new vote entry and save it
      var vote = new Vote({
        userID: req.user.provider_id,
        favorID: req.body.favor._id,
        vote: req.body.vote
      });
      vote.save(function (err) {
        if (err) console.log('ERROR in user creation on login: ', err);
        if (err) throw err;

        if( vote.vote === 1) {
          Favor.findByIdAndUpdate(req.body.favor._id,
            { $inc: {votes: 1} },
            function(err, data) {
              res.send('1');
            });
        } else { 
          Favor.findByIdAndUpdate(req.body.favor._id,
          { $inc: {votes: -1} },
          function(err, data) {
            res.send('-1'); 
          });
        }
      });
      }
    });
    

  },


  /**
   * This function does both upvoting and downvoting for photos
   * @method upVotePhoto
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  upVotePhoto: function(req, res, next) {
    


    //Query the Vote table for a specific entry with a certain photo/userID
    Vote.findOne({
      userID: req.user.provider_id,
      photoID: req.body.photo._id
    }, function (err, vote) {
      
      console.log(err);
      
      // console.log('ERROR in finding user on login: ', err);
      if (err) throw (err);
      
      // check if there's already a vote by this user...
      if (!err && vote != null) {
        console.log('you already voted on that...'); 
        console.log("req.body.vote", req.body.vote);
        console.log("vote.vote", vote.vote);
        if (req.body.vote === 1 && (vote.vote ===-1 || vote.vote ===0))  { //if sending an upvote, check if there is already a downvote

            //find that exact vote, photo, and up the user's kudos by 1
            Vote.findByIdAndUpdate(vote._id,
              { $inc: {vote: 1 } },
              function(err, data) {
                Photo.findByIdAndUpdate(req.body.photo._id, 
                { $inc: {votes: 1 } }, 
                function(err, data){
                  User.findByIdAndUpdate(req.user._id,
                    { $inc: {points: 1 } },
                    function(err, data) {
                      res.send('1');
                    });
                });
              });

        }

        else if(req.body.vote === -1 && (vote.vote === 1|| vote.vote ===0)){

            //find that exact vote, photo, and down the user's kudos by 1
            Vote.findByIdAndUpdate(vote._id,
              { $inc: {vote: -1 } },
              function(err, data) {
                Photo.findByIdAndUpdate(req.body.photo._id, 
                { $inc: {votes: -1 } }, 
                  function(err, data){
                    if (data.votes <= -4) {
                      data.remove()
                    } else if (data.votes > -5){
                      User.findByIdAndUpdate(req.user._id,
                        { $inc: {points: -1 } },
                        function(err, data) {
                          res.send('1');
                        });
                    }
                  });
              });
          
        } else { 
          res.send('0'); 
        }
        // //otherwise, you've already voted. send back 0
      } else {
      
      //Create a new vote table if one does not already exist!
      var vote = new Vote({
        userID: req.user.provider_id,
        photoID: req.body.photo._id,
        vote: req.body.vote
      });
      vote.save(function (err) {
        if (err) console.log('ERROR in user creation on login: ', err);
        if (err) throw err;

        if( vote.vote === 1) {
          Photo.findByIdAndUpdate(req.body.photo._id,
            { $inc: {votes: 1} },
            function(err, data) {
              res.send('1');
            });
        } else { 
          Photo.findByIdAndUpdate(req.body.photo._id,
          { $inc: {votes: -1} },
          function(err, data) {
            res.send('-1'); 
          });
        }
      });
      }
    });
    

  }
}
;var Favor = require('../db/favorModel.js');
var VotePhoto = require('../db/votePhotoModel.js');


module.exports = {
  /**
   * Description
   * @method upVote
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  upVote: function(req, res, next) {
  },

  /**
   * Description
   * @method downVote
   * @param {} req
   * @param {} res
   * @param {} next
   * @return 
   */
  downVote: function(req, res, next) {
  }
}
;var voteController = require('./voteController.js');
var votePhotoController = require('./votePhotoController.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function (app) {
  app.route('/upVote')
    .post(voteController.upVote);

  // app.route('/downVote')
  //   .post(voteController.downVote);

  app.route('/upVotePhoto')
  	.post(voteController.upVotePhoto);

};;var instagram = require('./instagramScrape.js');

/**
 * Description
 * @method exports
 * @param {} app
 * @return 
 */
module.exports = function(app) {
	app.post('/', instagram.getPhotosByLocation);
};
;var ig = require('instagram-node').instagram();

	var igCredentials;

if(process.env.PRODUCTION) {
	ig.use({
		client_id: process.env.instagram_clientID,
		client_secret: process.env.instagram_client_secret 
	});
} else {
	igCredentials = require('./instagramCredentials.js');

	ig.use({
		client_id: igCredentials.instagram_client_ID,
		client_secret: igCredentials.instagram_client_secret 
	});
}




module.exports =  {
	/**
	 * Description
	 * @method getPhotosByLocation
	 * @param {} req
	 * @param {} res
	 * @return 
	 */
	getPhotosByLocation: function(req,res){

		// console.log(, req.body.long);
		console.log("req.body")
		console.log(req.body);

		ig.location_search({ lat: req.body.lat, lng: req.body.long }, {distance:100} ,function(err, result, remaining, limit) {

			console.log(result);
			ig.location_media_recent(result[0].id, function(err, result, pagination, remaining, limit) {
				res.json(result);
			});			
		});

		// ig.location_media_recent('16334271', function(err, result, pagination, remaining, limit) {
		// 	res.json(result);
		// });
	}
}


;// var twitter = require('./twitterScrape.js');

// module.exports = function(app) {
// 	app.get('/', twitter.getPhotosByLocation);
// }
;// var Twitter = require("twitter");
// var credentials = require('./twitterCredentials.js');

// var client = Twitter({
// 	consumer_key: credentials.consumer_key,
// 	consumer_secret: credentials.consumer_secret,
// 	access_token_key: credentials.access_token_key,
// 	access_token_secret: credentials.access_token_secret
// });

// module.exports = {
	
// 	getPhotosByLocation: function(req, res) {
// 		console.log("I'm here oh yea");

// 		client.get('search/tweets', {
// 			q: "marina bay sands",
			
// 			result_type: 'recent',
// 			count: 5
// 		}, function (error, tweets, response) {

// 			if (error) {
// 			    console.log("Error getting data from Twitter API");
// 			    console.log(error);
// 			    res.send(404, "Sorry, bad Twitter handle - try again");
// 			} else {
// 				res.json(tweets);
// 			}
// 		})


// 	}
// }
