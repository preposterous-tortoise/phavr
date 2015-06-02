var Photo = require('../db/photoModel.js');
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
                                  request_id: req.body.favor_id
                                });
          photo.save(function (err) {
            if(err) { console.log(err); }
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
   
  }
}
