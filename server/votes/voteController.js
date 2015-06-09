var Favor = require('../db/favorModel.js');
var Photo = require('../db/photoModel.js');
var User = require('../db/userModel.js');

var Q = require('q');
var Vote = require('../db/voteModel.js');

module.exports = {
  upVote: function(req, res, next) {
    console.log("I NEED THIS PROVIDER ID BRUH "+req.user)


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
                console.log('THIS IS THE DATA DAWG!!!! '+data);
                  Favor.findByIdAndUpdate(req.body.favor._id, 
                  { $inc: {votes: -1 } }, 
                    function(err, data){
                        console.log("THIS IS DELETE DATA!"+ JSON.stringify(data))
                        if (data.votes <= -4) {
                          console.log("DETECTED LESS THAN -4, WILL NOW REMOVE!")
                          Favor.findOneAndRemove({
                            _id : req.body.favor_id
                          })
                          // data.remove()
                        } else if (data.votes > -5){
                          User.findByIdAndUpdate(req.user._id,
                            { $inc: {points: -1 } },
                            function(err, data) {
                              console.log('succesfully did points!!!!!!!!!!!!!');
                              res.send('-1');
                            });
                        }
                  });
              });
          
        } else { 
          console.log("AWWW NOOOOOO");
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
    


    //Query the Vote table for a specific entry with a certain photo/userID
    Vote.findOne({
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
                  User.findByIdAndUpdate(req.user._id,
                    { $inc: {points: 1 } },
                    function(err, data) {
                      console.log('succesfully did points!!!!!!!!!!!!!');
                      res.send('1');
                    });
                });
              });

        }

        else if(req.body.vote === -1 && (vote.vote === 1|| vote.vote ===0)){

            //vote.vote = -1;
            Vote.findByIdAndUpdate(vote._id,
              { $inc: {vote: -1 } },
              function(err, data) {
                console.log('succesfully did findbyidandupdate');
                Photo.findByIdAndUpdate(req.body.photo._id, 
                { $inc: {votes: -1 } }, 
                  function(err, data){
                    if (data.votes < -4) {
                      // Photo.findOneAndRemove({
                      //   _id : req.body.photo._id
                      // })
                      data.remove()
                    } else if (data.votes > -5){
                      User.findByIdAndUpdate(req.user._id,
                        { $inc: {points: -1 } },
                        function(err, data) {
                          console.log('succesfully did points!!!!!!!!!!!!!');
                          res.send('1');
                        });
                    }
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
