

var express = require('express')
var app = express();
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var db_port = process.env.MONGOLAB_URI || 'mongodb://localhost/drakeapp';

mongoose.connect(db_port);
require('./config/middleware.js')(app, express);
app.listen(port);
console.log("Now listening on port", port);