var Photo = require('../db/photoModel.js');
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
