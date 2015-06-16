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

  //Multer is an NPM module used to upload multi-part data
  app.use(multer({ dest: './uploads/', 
    rename: function(fieldname, filename) {
              console.log(fieldname);
              console.log(filename);
              return filename;
            }
  }));

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

  app.post('/auth/facebook/token',
    passport.authenticate('facebook-token'),
      function (req,res) {
        res.send(req.user? 201 : 401)
      });

  //Multer is an NPM module used to upload multi-part data
  app.use(multer({ dest: './uploads/', 
    rename: function(fieldname, filename) {
              return filename;
            }
  }));

  //Used to chunk the photos into one coherent file before uploading them to S3
  app.post('/photoUploads/uploadToServer', function(req,res){
    res.redirect('/photoUploads/uploadToS3/?fileName=' + req.files.file.originalname);
  });
  
  //Sending photos to S3
  app.get('/photoUploads/uploadToS3/', function(req,res){

  });
}

