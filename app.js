
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose/');

var Modlist = require('./models/modlist');

var configDB = require('./config/db.js').url;
var localURL = require('./config/localURL.js').url;

mongoose.connect(configDB);

var Schema = mongoose.Schema;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes.js') (app);

http.createServer(app).listen(app.get('port'), localURL, function(){
  console.log('Express server listening on port ' + app.get('port'));
});


