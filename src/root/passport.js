var LocalStrategy = require('passport-local').Strategy;

var Admin = require('./models/admin.min.js');
var Modlist = require('./models/modlist.min.js');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  Modlist.findById(id, function(err, user) {
	    done(err, user);
	  });
	});
	
	// Register
	passport.use('register', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		process.nextTick(function() {
			Modlist.findOne({'username' : username }, function(err, user) {
				if(err) {
					return done(err);
				}
				if(user) {
					return done(null, false, console.log("username already taken"));
				}
				else {
					var user = new Modlist(); // a change

					user.username = username;
					user.password = user.generateHash(password);

					user.save(function(err) {
						if(err) {
							throw err;
						}
						return done(null, user);
					});
				}
			});
		});
	}));
	
	// Login
	passport.use('login', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		Modlist.findOne({'username' : username }, function(err, user) {
			if(err) {
				return done(err);
			}
			else if(!user) {
				return done(null, false, console.log("username doesn't exist"));
			}
			else if(!user.validPassword(password)) {
				return done(null, false, console.log("Wrong Password"));

			}

			else {
				return done(null, user);
			}
		});
	}));
};
