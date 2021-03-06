module.exports = function(app, passport, scriptVersion) {

	app.get('/', function(req, res) {
		res.render('home.ejs', {
			login: false,
			admin: false,
			user: (req.user != undefined) ? req.user.username : ""
		});
	});
	app.get('/api/blog/newest', function(req, res) {
		Blog.findOne({'newest': true}, function(err, _blog) {
			if(_blog) {
				res.set('Content-Type','text/json');
				res.send(_blog);
			} else {
				res.writeHead(404);
				res.end();
			}
		});
	});
	app.get('/users', function(req, res) {
		res.render('allusers.ejs');
	});
	/**
	 *  DEPRECATED, moved to apiRoutes.js
	 */
	app.get('/userlist', function(req, res) {
		Modlist.find({}, {username:1}, function(err, _mods) {
			var mods_ = [];
			for(var i = _mods.length-1, j = 0; i >= 0; i--, j++) {
				mods_[j] = _mods[i].username;
			}
			res.set('Content-Type','text/json');
			res.send({"usernames":mods_});
		});
	});
	/**
	 *  DEPRECATED, moved to apiRoutes.js
	 */
	app.get('/scriptversion', function(req, res) {
		res.set('Content-Type','text');
		res.send(scriptVersion);
	});
	app.get('/rss', function(req, res) {
		Blog.find({}, function(err, _blogs) {
			if(_blogs) {
				var rsstext = "<rss version=\"2.0\"><channel><title>Modwat.ch Feed</title>";
				rsstext += "<description>An RSS feed to keep up with updates to Modwat.ch, a load order uploader.</description>";
				rsstext += "<link>http://modwat.ch</link>";
				rsstext += "<language>en-us</language>";
				for(var i = 0; i < _blogs.length; i++) {
					rsstext += "<item><title>"+_blogs[i].title+"</title><description>"+_blogs[i].desc+"</description>";
					rsstext += "<link>http://modwat.ch/blog/"+_blogs[i].unique+"</link><image><url>"+_blogs[i].thumbnail+"</url></image></item>";
					rsstext += "<pubDate>"+_blogs[i].date+"</pubDate>";
				}
				rsstext += "</channel></rss>";
				res.set('Content-Type','text/xml');
				res.send(rsstext);
			} else {
				res.writeHead('404');
				res.end();
			}
		});
	});
	/*app.get('/updateAll', function(req, res) {
		Modlist.find({}, function(err, _modlists) {
			if(_modlists) {
				for(var i = 0; i < _modlists.length; i++) {
					_modlists[i].UpdateOldStyleModlist();
				}
				res.send("Nailed it");
			} else {
				res.writeHead('404');
				res.end();
			}
		});
	});*/
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	app.get('/blog/:unique', function(req, res) {
		Blog.findOne({'unique': req.params.unique}, function(err, _blog) {
			Modlist.find({}, function(err, _mods) {
				var mods_ = [];
				for(var i = _mods.length-1, j = 0; i > _mods.length-6; i--, j++) {
					mods_[j] = _mods[i].username;
				}
				res.render('home.ejs', {
					title : _blog.title,
					author: _blog.author,
					thumbnailurl: _blog.thumbnail,
					date: (_blog.date.getMonth()+1)+"/"+_blog.date.getDate()+"/"+_blog.date.getFullYear(),
					content: _blog.body,
					mods: mods_,
					login: false,
					admin: false
				});
			});
		});
	});
	app.get('/json/:username', function(req, res) {
		Modlist.findOne({'username' : req.params.username}, function(err, _modlist) {

			if(_modlist) {
				if(_modlist.plugins.length < 1)
					_modlist.UpdateOldStyleModlist();
				res.setHeader('Content-Type', 'application/json');
				res.send({"username": req.params.username, "plugins": _modlist.plugins, "modlist": _modlist.modlist, "ini": _modlist.ini, "prefsini": _modlist.prefsini});
			} else {
				res.writeHead('404');
				res.end();
			}
		});
	});
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/admin',
		failureRedirect: '/login'
	}));
	app.get('/:username', function(req, res) {
		Modlist.findOne({username: req.params.username},{username:1}, function(err, _list) {
			if(!_list) {
				res.redirect('/');
			}
			else {
				/*if(_list.list && _list.list.length > 0) {
					_list.UpdateOldStyleModlist();
				}*/
				res.render('profile.ejs', {
					username: _list.username,
					owner: (req.user != undefined && req.user.username == req.params.username) ? true : false
				});
			}
		});
	});
	// COMMENT OUT, ONLY NEED 1 ADMIN FOR NOW
	/*app.post('/register', passport.authenticate('register', {
		successRedirect : '/admin',
		failureRedirect : '/'
	}));*/

	app.post('/usersearch', function(req, res) {
		res.redirect('/'+req.body.username);
	});
	app.post('/newENB/:username', isLoggedIn, function(req, res) {
		if(req.user.username == req.params.username) {
			Modlist.findOne({username: req.params.username}, function(err, _list) {
				if(_list) {
					_list.enb = req.body.enb;
					_list.save(function(err) {
						if(err) {
							console.log(err);
						} else {
							res.statusCode = 200;
							res.end();
						}
					});
				} else {
					res.writeHead(404);
					res.end();
				}
			});
		} else {
			res.writeHead(403);
			res.end();
		}
	});
	app.post('/newTag/:username', isLoggedIn, function(req, res) {
		if(req.user.username == req.params.username) {
			Modlist.findOne({username: req.params.username}, function(err, _list) {
				if(_list) {
					_list.tag = req.body.tag;
					_list.save(function(err) {
						if(err) {
							console.log(err);
							res.writeHead(500);
							res.end();
						} else {
							res.statusCode = 200;
							res.end();
						}
					});
				} else {
					res.writeHead(404);
					res.end();
				}
			});
		} else {
			res.writeHead(403);
			res.end();
		}
	});
	app.post('/:username/newpass', function(req, res) {
		Modlist.findOne({'username' : req.params.username}, function(err, _modlist) {
			if(_modlist) {
				if(_modlist.validPassword(req.body.oldPassword)) {
					_modlist.password = _modlist.generateHash(req.body.newPassword);
					_modlist.save(function(err) {
						if(err) {
							console.log(err);
						} else {
							// nope
						}
					});
					res.statusCode = 200;
					res.write("Password changed");
					res.end();
				} else {
					res.statusCode = 403;
					res.write("Access denied, incorrect password");
					res.end();
				}
			} else {
				res.statusCode = 400;
				res.write("No username found");
				res.end();
			}
		});
	});
	app.post('/fullloadorder', function(req, res) {
		Modlist.findOne({'username' : req.body.username}, function(err, _modlist) {
			if(_modlist) { // if the username exists in the db
				//console.log(req.body.modlisttxt);
				if(_modlist.validPassword(req.body.password)) {
					_modlist.list = req.body.plugins;
					_modlist.modlisttxt = req.body.modlisttxt;
					_modlist.skyrimini = req.body.skyrimini;
					_modlist.skyrimprefsini = req.body.skyrimprefsini;
					_modlist.timestamp = Date.now();
					_modlist.save(function(err) {
						if(err) {
							res.statusCode = 500;
							console.logor(err);
							res.write(err);
							res.end();
							throw err;
						} else {
							_modlist.UpdateOldStyleModlist();
							res.statusCode = 200;
							res.end();
						}
					});
				}
				else {
					res.statusCode = 403;
					res.write("Access denied, incorrect password");
					res.end();
				}
			}
			else { // if the username does not exist
        // ^[a-zA-Z0-9_-]*$
        // console.log(req.body.username.match('^[a-zA-Z0-9_-]*$'));
        // if match then create, else error out
				var modlist = new Modlist();
				modlist.list = req.body.plugins;
				modlist.modlisttxt = req.body.modlisttxt;
				modlist.skyrimini = req.body.skyrimini;
				modlist.skyrimprefsini = req.body.skyrimprefsini;
				modlist.username = req.body.username;
				modlist.timestamp = Date.now();
				modlist.password = modlist.generateHash(req.body.password);

				modlist.save(function(err) {
					if(err) {
						res.statusCode = 500;
						console.logor(err);
						res.write(err);
						res.end();
						throw err;
					}
					else {
						modlist.UpdateOldStyleModlist();
						res.statusCode = 200;
						res.end();
					}
				});
			}
		});
	});
};

var Blog = require('./public/models/blog.min.js');
var Modlist = require('./public/models/modlist.min.js');
function isLoggedIn(req, res, next) {

	if(req.isAuthenticated()) {
		return next();
	}
	else {
		res.writeHead(403);
		res.end();
	}
}
