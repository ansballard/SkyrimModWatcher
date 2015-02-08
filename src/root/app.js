
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose/'); 

var configDB = require('./config/db.js').url;
mongoose.connect(configDB);

var Schema = mongoose.Schema;

require('./passport.min.js')(passport);

// all environments
app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
  	app.use(express.bodyParser());
	app.use(express.session({secret: process.env.DBEXPRESSSECRET}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
});

var scriptVersion = "0.26b";

require('./routes.min.js') (app, passport, scriptVersion);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


