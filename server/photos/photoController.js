// var Photo = require('./photoModel.js');
// var Q = require('q');

module.exports = {
  createPhoto: function(req, res, next) {
    res.send('createPhoto called with body: ' + JSON.stringify(req.body));
  },
  updatePhoto: function(req, res, next) {
    res.send('updatePhoto called with body: ' + JSON.stringify(req.body));
  }
}