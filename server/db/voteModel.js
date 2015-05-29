var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VoteSchema = new Schema({
	userID				: String, // userID
    favorID : String, //favorID
    photoID: String,
	vote : Number, // 0(Nuetral), 1(upvote), -1(downvote)
});

module.exports = mongoose.model('votes', VoteSchema);