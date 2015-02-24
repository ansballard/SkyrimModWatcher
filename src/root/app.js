var express = require('express');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var favicon = require('serve-favicon');
  var methodOverride = require('method-override');
  var session = require('express-session');
  var cors = require('cors');
var app = express();

var http = require('http');
var path = require('path');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose/');

var configDB = require('./config/db.js').dev3url;
mongoose.connect(configDB);
var Schema = mongoose.Schema;

require('./passport.min.js')(passport);

var corsOptions = {
  origin: true,
  methods: ['GET','POST']
}

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({secret: process.env.DBEXPRESSSECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

var scriptVersion = "0.26b";

require('./routes.min.js') (app, passport, scriptVersion);

require('./apiRoutes.min.js') (app, cors, corsOptions);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


