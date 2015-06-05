//Different NPM Modules
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
// var FacebookStrategy = require('passport-facebook').Strategy;
//var  FacebookTokenStrategy = require('passport-facebook-token');

    
/**
 * Core Middleware
 *
 * Sets up top-level routes, authentication, and session initialization
 *
 * @param {Application} app - Express Application
 * @param {Express} express
 * @api public
 */
module.exports = function(app, express){






  // Passport initialization
  auth.init(passport);
  app.use(passport.initialize());
  app.use(passport.session());
  // Passport Routes 
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/signin.html');
  });
  app.use(cookieParser('add a secret here'));
  app.use(session({ secret: 'xyz-qwrty', resave: false, saveUninitialized: true }));

  var photoRouter = express.Router();
  var favorRouter = express.Router();
  var voteRouter = express.Router();

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



  app.post('/location', function(req,res){
    console.log(req);
    console.log("_________________________________________________");
    console.log(req.body);
    console.log("*************************************************");
    res.send(200);
  })


  //Used to grab user information from the user proprty of request. Provides FB info for name and profile picture
  app.get('/api/profileID', passport.authenticate('facebook-token'), 
    function(req, res){
    
      res.send(req.user);

  });

  //Adding routes
  require('../favors/favorRoutes.js')(favorRouter);
  require('../photos/photoRoutes.js')(photoRouter);
  require('../votes/voteRoutes.js')(voteRouter);



  // //Setting up twitter and instagram scraping routes
  // var twitterScrapeRouter = express.Router();
  // app.use('/api/twitter', /*auth.athenticate*/ twitterScrapeRouter);
  // require("../webScraping/twitterRoutes.js")(twitterScrapeRouter);

  //var instagramScrapeRouter = express.Router();
  //app.use('/api/instagram', /*auth.athenticate*/ instagramScrapeRouter);
  //require("../webScraping/instagramRoutes.js")(instagramScrapeRouter);

app.post('/auth/facebook/token',
  passport.authenticate('facebook-token'),
    function (req,res) {
      console.log('authorized user!');
      console.log(req.user);
      res.send(req.user? 201 : 401)
    }
  );


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

