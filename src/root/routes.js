module.exports = function(app, passport, scriptVersion) {

	app.get('/', function(req, res) {
		console.log((req.user != undefined) ? req.user.username : "none");
		Blog.findOne({'newest': true}, function(err, _blog) {
			res.render('home.ejs', {
				title : _blog.title,
				author: _blog.author,
				thumbnailurl: _blog.thumbnail,
				date: (_blog.date.getMonth()+1)+"/"+_blog.date.getDate()+"/"+_blog.date.getFullYear(),
				content: _blog.body,
				login: false,
				admin: false,
				user: (req.user != undefined) ? req.user.username : ""
			});
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
	/*app.get('/admin', isLoggedIn, function(req, res) {
		Blog.findOne({'newest': true}, function(err, _blog) {
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
					login: false,
					admin: true,
					mods: mods_
				});
			});
		});
	});*/
	app.get('/users', function(req, res) {
		res.render('allusers.ejs');
	});
	app.get('/userlist', function(req, res) {
		Modlist.find({}, function(err, _mods) {
			var mods_ = [];
			for(var i = _mods.length-1, j = 0; i >= 0; i--, j++) {
				mods_[j] = _mods[i].username;
			}
			res.set('Content-Type','text/json');
			res.send({"usernames":mods_});
		});
	});
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
	/*app.get('/GPUList', function(req, res) {
		Modlist.find({}, function(err, _modlists) {
			if(_modlists) {
				var amd = 0;
				var nvidia = 0;
				var gpus = [];
				var gpuAmt = 0;
				for(var i = 0; i < _modlists.length; i++) {
					var tmp = _modlists[i].GetGPU();
					if(tmp != 0) {
						if (_modlists[i].GetGPU().indexOf("NVIDIA") >= 0) {
							nvidia++;
						} else if(_modlists[i].GetGPU().indexOf("AMD") >= 0) {
							amd++;
						}
						if(gpuAmt == 0) {
							gpus[0] = {"name":tmp, "amount":1};
							gpuAmt++;
						} else {
							var found = false;
							for(var j = 0; j < gpuAmt; j++) {
								if(tmp == gpus[j].name) {
									gpus[j].amount++;
									found = true;
									break;
								}
							}
							if(!found) {
								gpus[gpuAmt] = {"name":tmp, "amount":1};
								gpuAmt++;
							}
						}
					}

					console.log("NVIDIA: "+nvidia + "\t\tAMD: " + amd + "\t\ttmp: " + tmp);
				}
				res.set('Content-Type','text/json');
				res.send({"NVIDIA":nvidia, "AMD":amd, "GPUS": gpus});
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
				_modlist.UpdateOldStyleModlist();
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
		Modlist.findOne({username: req.param("username")}, function(err, _list) {
			if(!_list) {
				res.redirect('/');
			}
			else {
				if(_list.list.length > 0) {
					_list.UpdateOldStyleModlist();
				}
				res.render('profile.ejs', {
					username: _list.username,
					timestamp: (_list.timestamp.getMonth()+1) + "/" + _list.timestamp.getDate() + "/" + _list.timestamp.getFullYear(),
					enb: _list.enb,
					game: _list.game,
					owner: (req.user != undefined && req.user.username == req.param("username")) ? true : false,
					enb: _list.enb != undefined ? _list.enb : "",
					tag: _list.tag != undefined ? _list.tag : ""
				});
			}
		});
	});
	app.get('/api/:username/:filename', function(req, res) {
		Modlist.findOne({username: req.param("username")}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				_list.UpdateOldStyleModlist();
				res.setHeader('Content-Type', 'application/json');

				if(req.param("filename") == 'plugins') {
					res.end(JSON.stringify(_list.plugins));
				}
				else if(req.param("filename") == 'modlist') {
					res.end(JSON.stringify(_list.modlist));
				}
				else if(req.param("filename") == 'ini') {
					res.end(JSON.stringify(_list.ini));
				}
				else if(req.param("filename") == 'prefsini') {
					res.end(JSON.stringify(_list.prefsini));
				}
				else {
					res.end(JSON.stringify([]));
				}
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
		if(req.user.username == req.param("username")) {
			Modlist.findOne({username: req.param("username")}, function(err, _list) {
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
		if(req.user.username == req.param("username")) {
			Modlist.findOne({username: req.param("username")}, function(err, _list) {
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
	/*app.post('/postnewblog', isLoggedIn, function(req, res) {
		var blog = new Blog();
		blog.title = req.body.title;
		blog.thumbnail = req.body.thumbnail;
		blog.body = req.body.content.replace(new RegExp('\r?\n','g'), '<br />');
		blog.desc = req.body.desc;
		blog.author = req.body.author;
		blog.unique = req.body.thumbnail.split('/')[1].split('.')[0];
		blog.save(function(err) {
			if(err) {
				console.log("Post Error: "+err);
				res.writeHead('500');
				res.end();
				throw err;
			}
			else {
				console.log("New Blog Entry Uploaded By "+req.body.author);
				Blog.findOne({'newest': true}, function(err, _blog) {
					_blog.newest = false;
					_blog.save();
				});
				res.redirect('/');
			}
		});
	});*/
	app.post('/:username/newpass', function(req, res) {
		Modlist.findOne({'username' : req.param("username")}, function(err, _modlist) {
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
	app.post('/loadorder', function(req, res) {
		Modlist.findOne({'username' : req.body.username}, function(err, _modlist) {
			if(_modlist) { // if the username exists in the db
				if(_modlist.validPassword(req.body.password)) {
					_modlist.UpdateOldStyleModlist();

					_modlist.plugins = req.body.plugins;
					_modlist.modlist = req.body.modlist;
					_modlist.ini = req.body.ini;
					_modlist.prefsini = req.body.prefsini;
					_modlist.enb = req.body.enb;
					_modlist.game = req.body.game;
					_modlist.tags = req.body.tags;
					_modlist.timestamp = Date.now();
					_modlist.save(function(err) {
						if(err) {
							res.statusCode = 500;
							console.logor(err);
							res.write(err);
							res.end();
							throw err;
						} else {
							console.log(_modlist.game);
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

				var modlist = new Modlist();
				modlist.plugins = req.body.plugins;
				modlist.modlist = req.body.modlist;
				modlist.ini = req.body.ini;
				modlist.prefsini = req.body.prefsini;
				modlist.enb = req.body.enb;
				modlist.game = req.body.game;
				modlist.tags = req.body.tags;
				modlist.timestamp = Date.now();
				modlist.username = req.body.username;
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
						console.log("new user created");
						res.statusCode = 200;
						res.end();
					}
				});
			}
		});
	});
	/*app.post('/admin/:username/delete', isLoggedIn, function(req, res) {
		Modlist.findOne({'username' : req.body.username}, function(err, _modlist) {
			if(_modlist) { // if the username exists in the db
				_modlist.remove(function(err) {
					if(err) {
						console.log(err);
					} else {
						//
					}
				});
			} else {
				console.log("Username "+req.body.username+" not found");
			}
			if(err) {
				console.log(err);
			} else {
				//
			}
		});
	});*/
};

var Blog = require('./models/blog.min.js');
var Modlist = require('./models/modlist.min.js');
function isLoggedIn(req, res, next) {

	if(req.isAuthenticated()) {
		return next();
	}
	else {
		res.writeHead(403);
		res.end();
	}
}
