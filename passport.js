var LocalStrategy = require('passport-local').Strategy;

var Admin = require('./models/admin');

module.exports = function(passport) {

	passport.serializeUser(function(admin, done) {
	  done(null, admin.id);
	});

	passport.deserializeUser(function(id, done) {
	  Admin.findById(id, function(err, admin) {
	    done(err, admin);
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
			console.log(req.body);
			Admin.findOne({'username' : username }, function(err, admin) {
				if(err) {
					return done(err);
				}
				if(admin) {
					return done(null, false, console.log("username already taken"));
				}
				else {
					var admin = new Admin(); // a change

					admin.username = username;
					admin.password = admin.generateHash(password);

					admin.save(function(err) {
						if(err) {
							throw err;
						}
						return done(null, admin);
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
		Admin.findOne({'username' : username }, function(err, admin) {
			if(err) {
				return done(err);
			}
			else if(!admin) {
				return done(null, false, console.log("username doesn't exist"));
			}
			else if(!admin.validPassword(password)) {
				return done(null, false, console.log("Wrong Password"));

			}

			else {
				return done(null, admin);
			}
		});
	}));
};
