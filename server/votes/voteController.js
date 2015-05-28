var Favor = require('../db/favorModel.js');
var Q = require('q');
var Vote = require('../db/voteModel.js');

module.exports = {
  upVote: function(req, res, next) {
    console.log("THIS IS THE REQUEST "+ JSON.stringify(req.body));
    Vote.findOne({
      userID: req.session.passport.user.provider_id,
      favorID: req.body._id
    }, function (err, vote) {
      console.log("THIS IS USER! "+vote);
      // console.log('ERROR in finding user on login: ', err);
      if (err) throw (err);
      // console.log('LOGIN no error, user: ', user);
      if (!err && vote != null) { 
        if (req.body.votes === 1)  {
          if (vote.vote === -1) {
            vote.vote = 1;
            Favor.findByIdAndUpdate(req.body._id, 
              {votes: req.body.votes+2 }, 
              function(err, data){
              res.send('successfully downvoted');
            });
          }
        }

        else if(req.body.votes === -1){
          if (vote.vote === 1){
            vote.vote = -1;
            Favor.findByIdAndUpdate(req.body._id, 
              {votes: req.body.votes-2 }, 
              function(err, data){
              res.send('successfully downvoted');
            });
          }
        }
        return;
      }
      
      var vote = new Vote({
        userID: req.session.passport.user.provider_id,
        favorID: req.body._id,
        vote: req.body.votes
      });
      vote.save(function (err) {
        if (err) console.log('ERROR in user creation on login: ', err);
        if (err) throw err;
        // done(null, user);
      });
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
  }
}