var mongoose = require('mongoose');

/* photos taken by users to fulfill requests/favors.
 * photos are attached to a user and a request.
 */

var PhotoSchema = new mongoose.Schema({
  url: String,
  request_id: Number,
  user_id: Number,
  votes: Number,
  loc: Array,
  createdAt: { type: Date, expires: 86400, default: Date.now },
});

module.exports = mongoose.model('photo', PhotoSchema);

