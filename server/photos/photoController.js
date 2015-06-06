var Photo = require('../db/photoModel.js');
var Notifier = require('../push/pushNotify.js');
// var Q = require('q');
var aws = require('aws-sdk');
var uuid = require('uuid');
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

module.exports = {
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

  createDummyPhoto: function(req, res, next) {
    var photo = new Photo({ url: req.body.url, 
                            request_id: req.body.favor_id
                          });
    photo.save(function (err, photo) {
      if(err) { console.log(err); }
      res.status(201).send(photo);
    });

  },

  //Query the Photo table for photos from a certain favor
  fetchPhotosForFavor: function(req, res, next) {
    var query = Photo.find({
      request_id: req.body.favor_id
    });
    query.exec(function(err, docs) {
      res.json(docs);
      if (err) {
        console.log('ERROR in fetchPhotosForFavor ', err)
        res.send('ERROR in fetchPhotosForFavor ' + err)
      }
    });
  },

  
  updatePhoto: function(req, res, next) {
    res.send('updatePhoto called with body: ' + JSON.stringify(req.body));
  },

  upVotePhoto: function(req, res, next) {
    
  },

  downVotePhoto: function(req, res, next) {
   
  },

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

  uploadToServer: function(req,res){
    console.log("_________________");
     console.log(req.files);
    res.redirect('/api/photos/photoUploads/uploadToS3/?fileName=' + req.files.file.originalname);
  }
}
