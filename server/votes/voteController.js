var Favor = require('../db/favorModel.js');
var Photo = require('../db/photoModel.js');

var Q = require('q');
var Vote = require('../db/voteModel.js');

module.exports = {
  upVote: function(req, res, next) {
    


    // req.body.favor = { _id: req.body.favor_id };
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
        if (req.body.vote === 1 && (vote.vote ===-1 || vote.vote ===0))  { //if sending an upvote, check if there is already a downvote

            console.log('overriding downvote');
            //override the downvote
            //vote.vote = 1;
            Vote.findByIdAndUpdate(vote._id,
              { $inc: {vote: 1 } },
              function(err, data) {
                console.log('succesfully did findbyidandupdate');
                Favor.findByIdAndUpdate(req.body.favor._id, 
                { $inc: {votes: 1 } }, 
                function(err, data){
                  console.log("AWWWW im in callback")
                  res.send('1');
                });
              });

        }

        else if(req.body.vote === -1 && (vote.vote === 1|| vote.vote ===0)){

            //vote.vote = -1;
            Vote.findByIdAndUpdate(vote._id,
              { $inc: {vote: -1 } },
              function(err, data) {
                Favor.findByIdAndUpdate(req.body.favor._id, 
                  { $inc: {votes: -1} }, 
                  function(err, data){
                                      console.log("AWWWW im in 2nd callback")

                    res.send('-1');
                  });
            });
          
        } else { 
          console.log("AWWW NOOOOOO");
          res.send('0'); 
        }
        // //otherwise, you've already voted. send back 0
      } else {
      
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
            console.log('downvoted!!!');
            res.send('-1'); 
          });
        }
        // done(null, user);
      });
      }
    });
    

  },

  downVote: function(req, res, next) {
    // var userObj = req.session.passport.user;
    // var create, newPortfolio;

    Favor.findByIdAndUpdate(req.body._id, 
      {votes: req.body.votes-1 }, 
      function(err, data){
      res.send('successfully downvoted');
    });
  },

  upVotePhoto: function(req, res, next) {
    


    // req.body.favor = { _id: req.body.favor_id };
    Photo.findOne({
      userID: req.user.provider_id,
      photoID: req.body.photo._id
    }, function (err, vote) {
      
      console.log("photoID", req.body.photo._id);
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
        if (req.body.vote === 1 && (vote.vote ===-1 || vote.vote ===0))  { //if sending an upvote, check if there is already a downvote

            console.log('overriding downvote');
            //override the downvote
            //vote.vote = 1;
            Vote.findByIdAndUpdate(vote._id,
              { $inc: {vote: 1 } },
              function(err, data) {
                console.log('succesfully did findbyidandupdate');
                Photo.findByIdAndUpdate(req.body.photo._id, 
                { $inc: {votes: 1 } }, 
                function(err, data){
                  console.log("AWWWW im in callback")
                  res.send('1');
                });
              });

        }

        else if(req.body.vote === -1 && (vote.vote === 1|| vote.vote ===0)){

            //vote.vote = -1;
            Vote.findByIdAndUpdate(vote._id,
              { $inc: {vote: -1 } },
              function(err, data) {
                Photo.findByIdAndUpdate(req.body.photo._id, 
                  { $inc: {votes: -1} }, 
                  function(err, data){
                                      console.log("AWWWW im in 2nd callback")

                    res.send('-1');
                  });
            });
          
        } else { 
          console.log("AWWW NOOOOOO");
          res.send('0'); 
        }
        // //otherwise, you've already voted. send back 0
      } else {
      
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
            console.log('downvoted!!!');
            res.send('-1'); 
          });
        }
        // done(null, user);
      });
      }
    });
    

  }
}
