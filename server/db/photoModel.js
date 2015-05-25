var mongoose = require('mongoose');

/* photos taken by users to fulfill requests/favors.
 * photos are attached to a user and a request.
 */

var PhotoSchema = new mongoose.Schema({
  url: String,
  request_id: Number,
  user_id: Number,
  votes: { type: Number, default: 0 },
  loc: {
   'type': {type: String, enum: "Point", default: "Point"},
   'coordinates': { type: [Number],   default: [0,0]} 
  },
  createdAt: { type: Date, expires: 86400, default: Date.now },
  icon: String
});

PhotoSchema.index({loc: '2dsphere'});

module.exports = mongoose.model('photo', PhotoSchema);

