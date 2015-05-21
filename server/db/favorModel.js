var mongoose = require('mongoose');

/* favors/requests, created by users.
 * a user creates a request for a photo fitting the description, located in the specified area.
 * as users fulfill the request, photos are added to the request.
 * favors belong to a user.
 */

var FavorSchema = mongoose.Schema({
  topic: String,
  description: String,
  user_id: Number,
  photos: Array,
  loc: Array,
  votes: Number,
  isPrivate: Boolean,
  createdAt: { type: Date, expires: 86400, default: Date.now }
});

module.exports = mongoose.model('favor', FavorSchema);

