var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VotePhotoSchema = new Schema({
	userID				: String, // userID
    photoID : String, //favorID
	vote : Number, // 0(Nuetral), 1(upvote), -1(downvote)
});

module.exports = mongoose.model('votePhotos', VotePhotoSchema);