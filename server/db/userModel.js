// Database user model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name				: String, // user name
  screen_name : String,
	provider		: String, // Twitter, Facebook, etc
	provider_id : {type: String, unique: true}, // id returned by Twitter, Facebook, etc.
	photo			 : String, // user's photo or avatar
	createdAt	 : {type: Date, default: Date.now} 
});

module.exports = mongoose.model('users', UserSchema);
