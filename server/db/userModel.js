// Database user model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String, // user name
	notify_favors: Boolean, // push notify for new nearby favors
	notify_photos: Boolean, // push notify for photos for my favors
  screen_name : String,
	provider: String, // Twitter, Facebook, etc
	provider_id : {type: String, unique: true}, // id returned by Twitter, Facebook, etc.
	photo: String, // user's photo or avatar,
	points: Number,
	loc: {
   'type': {type: String, enum: "Point", default: "Point"},
   'coordinates': { type: [Number],   default: [0,0]} 
  },
	createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('users', UserSchema);
