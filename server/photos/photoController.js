// var Photo = require('./photoModel.js');
// var Q = require('q');
var aws = require('aws-sdk');
var uuid = require('uuid');

module.exports = {
  createPhoto: function(req, res, next) {
    var s3 = new aws.S3();
    var fileName = uuid.v1();
    var params = {Bucket: 'drakeapp-photos', Body: req.body, Key: fileName, ACL: 'public-read'};
    s3.putObject(params, function(err, info) {
      if(err) {
        console.log(err);
      } else {
          //create a new photo object for db, attach it to the request
          res.status(201).send('https://drakeapp-photos.s3.amazonaws.com/'+fileName+'.jpg');
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
