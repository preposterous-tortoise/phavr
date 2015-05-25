var Photo = require('../db/photoModel.js');
// var Q = require('q');
var aws = require('aws-sdk');
var uuid = require('uuid');
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

module.exports = {
  createPhoto: function(req, res, next) {
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var fileName = uuid.v1();
    var params = {Bucket: S3_BUCKET, Body: req.body.image, Key: fileName, ACL: 'public-read', ContentType:'image/jpg'};
    console.log('body',req.body);
    s3.getSignedUrl('putObject', params, function(err, info) {
      if(err) {
        console.log(err);
      } else {
          //create a new photo object for db
          var photo = new Photo({ url: 'https://drakeapp-photos.s3.amazonaws.com/'+fileName+'.jpg', 
                                  request_id: req.body.favor_id
                                });
          photo.save(function (err) {
            if(err) { console.log(err); }
            res.status(201).send('Photo saved at https://drakeapp-photos.s3.amazonaws.com/'+fileName+'.jpg');
          });
      }
    });
  },

  //for upvotes/downvotes
  updatePhoto: function(req, res, next) {
    res.send('updatePhoto called with body: ' + JSON.stringify(req.body));
  },

  upVotePhoto: function(req, res, next) {
    // var userObj = req.session.passport.user;
    // var create, newPortfolio;

    // Photo.findAndModify({
    //   query: { _id: req.body.photoID }, 
    //   update: { $inc: { votes: 1} }, 
    //   },
    //   function(err, doc){
    //       console.log('There was an error with the upPhotoVotes!!!!!');
    //   });
    // res.status(201).send('updateFavor called with body: ' + JSON.stringify(req.body));
  },

  downVotePhoto: function(req, res, next) {
    // var userObj = req.session.passport.user;
    // var create, newPortfolio;

  //   Photo.findAndModify({
  //     query: { _id: req.body.photoID }, 
  //     update: { $inc: { votes: -1} }, 
  //     },
  //     function(err, doc){
  //         console.log('There was an error with the downPhotoVotes!!!!!');
  //     });
  //   res.send('updateFavor called with body: ' + JSON.stringify(req.body));
  }
}
