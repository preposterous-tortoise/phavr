var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var multer  = require('multer');

var User = require('../db/userModel.js');


//Auth
var auth = require('../auth/authPassport');
var FacebookStrategy = require('passport-facebook').Strategy;

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
  app.use(cookieParser('add a secret here'));
  app.use(session({ secret: 'xyz-qwrty', resave: false, saveUninitialized: true }));

  var photoRouter = express.Router();
  var favorRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  // app.get('/', auth.signInIfNotAuthenticated);
  app.use('/index.html', auth.signInIfNotAuthenticated);
  app.use(express.static(path.join(__dirname,'/../../drakeapp/www')));


  app.use('/api/requests', /*auth.authenticate, */favorRouter);
  app.use('/api/photos', /*auth.authenticate,*/ photoRouter);

  app.get('/api/profileID', auth.authenticate, function(req, res){
      var id = req.session.passport.user.provider_id
      console.log("THIS IS THE ID!!!! "+id)
      User.findOne(
        {$query:{ provider_id: id}}, 
      function(err, data){
      res.json(data); 
    });   
      // res.json(req.session.passport.user);
  });

  require('../favors/favorRoutes.js')(favorRouter);
  require('../photos/photoRoutes.js')(photoRouter);

  // //Setting up twitter and instagram scraping routes
  // var twitterScrapeRouter = express.Router();
  // app.use('/api/twitter', /*auth.athenticate*/ twitterScrapeRouter);
  // require("../webScraping/twitterRoutes.js")(twitterScrapeRouter);

  //var instagramScrapeRouter = express.Router();
  //app.use('/api/instagram', /*auth.athenticate*/ instagramScrapeRouter);
  //require("../webScraping/instagramRoutes.js")(instagramScrapeRouter);


  // Passport initialization
  auth.init(passport);
  app.use(passport.initialize());
  app.use(passport.session());
  // Passport Routes 
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/signin.html');
  });



  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['user_friends']} ));
  app.get('/auth/facebook/callback', passport.authenticate('facebook',
    { successRedirect: '/', failureRedirect: '/login' }
  ));
  app.get('/test', function(req, res){
    console.log('at /test, session: ', req.session);
    res.send('get /test OK');
  })

   app.use(multer({ dest: './uploads/', rename: function(fieldname, filename) {
    console.log(fieldname, filename);
      return "asdf";
   }}));

  app.post('/photoUploads/uploadToServer', function(req,res){
    console.log("HEADERSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
    console.log(req.headers);


    console.log("PHOTO PHOTO");
    console.log('BOOOOOOOOOOODDDDDDYYYYYYY');
    console.log(req.body);
    console.log("FIIIIIIIILLEEEEEEEEEEES");
    console.log(req.files);
    console.log("*********************");
     console.log(req);
    res.redirect('/photoUploads/uploadToS3');
  });

  app.get('/photoUploads/uploadToS3', function(req,res){

       // console.log("**************************");
       // console.log(file.fieldname + ' uploaded to  ' + file.path)
       console.log("HEADERSSSSSSSSSSSSSSSSSSSSSSSSSSSSS--------uploadToS3");
       console.log(req.headers);


       var fmt = require('fmt');
       var amazonS3 = require('awssum-amazon-s3');
       var fs = require('fs');

       var s3 = new amazonS3.S3({
           'accessKeyId'     : process.env.AWS_ACCESS_KEY_DARREN,
           'secretAccessKey' : process.env.AWS_SECRET_KEY_DARREN,
           'region'          : "us-east-1"
       });

       // you must run fs.stat to get the file size for the content-length header (s3 requires this)
       fs.stat("./uploads/asdf.jpg", function(err, file_info) {
           var bodyStream = fs.createReadStream("./uploads/asdf.jpg");
           var options = {
               BucketName    : "darrendrakeapp",
               ObjectName    : "newimage.jpg",
               ContentLength : file_info.size,
               Body          : bodyStream
           };
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

