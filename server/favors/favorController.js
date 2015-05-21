// var Favor = require('./favorModel.js');
// var Q = require('q');

module.exports = {
  fetchFavors: function(req, res, next) {
    res.send('fetchFavors called with body: ' + JSON.stringify(req.body));
  },
  createFavor: function(req, res, next) {
    res.send('createFavor called with body: ' + JSON.stringify(req.body));
  },
  updateFavor: function(req, res, next) {
    res.send('updateFavor called with body: ' + JSON.stringify(req.body));
  }
}