module.exports = function(app, passport) {

	app.get('/', function(req, res) {
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
					admin: false,
					mods: mods_
				});
			});
		});
	});
	app.get('/admin', isLoggedIn, function(req, res) {
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
	});
	app.get('/users', function(req, res) {
		Modlist.find({}, function(err, _mods) {
			var mods_ = [];
			for(var i = _mods.length-1, j = 0; i >= 0; i--, j++) {
				mods_[j] = _mods[i].username;
			}
			res.render('allusers.ejs', {
				mods: mods_
			});
		});
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
					rsstext += "<link>http://modwat.ch/blog/"+_blogs[i].unique+"</link><image>"+_blogs[i].thumbnail+"</image></item>";
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
	app.get('/login', function(req, res) {
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
					login: true,
					admin: false,
					mods: mods_
				});
			});
		});
	});
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
	// 
	/*app.get('/Peanut', function(req, res) {
		Modlist.findOne({username: "Peanut"}, function(err, _lists) {
			if(!_lists) {
				res.redirect('/');
			}
			else {
				if(_lists.length == 0) {
					console.log("empty?");
					_lists = "";
				}
				console.log(_lists.skyrimini);
				res.render('peanut.ejs', {
					list : _lists.list,
					modlist : _lists.modlisttxt,
					skyrimini : _lists.skyrimini,
					skyrimprefsini : _lists.skyrimprefsini,
					username: _lists.username
				});
			}
		});
	});*/
	app.get('/:username', function(req, res) {
		Modlist.findOne({username: req.param("username")}, function(err, _lists) {
			if(!_lists) {
				res.redirect('/');
			}
			else {
				var save = false;
				if(_lists.list == null) {
					_lists.list = "[]";
					save = true;
				}
				if(_lists.modlisttxt == null) {
					_lists.modlisttxt = "[]";
					save = true;
				}
				if(_lists.skyrimini == null) {
					_lists.skyrimini = "[]";
					save = true;
				}
				if(_lists.skyrimprefsini == null) {
					_lists.skyrimprefsini = "[]";
					save = true;
				}
				if(save) {
					console.log("saved");
					_lists.save();
				}
				//console.log(_lists.list+"\n\n"+_lists.modlisttxt+"\n\n"+_lists.skyrimini+"\n\n"+_lists.skyrimprefsini);
				res.render('index.ejs', {
					list : _lists.list,
					modlist : _lists.modlisttxt,
					skyrimini : _lists.skyrimini,
					skyrimprefsini : _lists.skyrimprefsini,
					username: _lists.username
				});
			}
		});
	});
	app.get('/text/:username/:filetype', function(req, res) {
		Modlist.findOne({'username' : req.params.username}, function(err, _modlist) {
			if(_modlist) {
				var list;
				if(req.params.filetype == "plugins")
					list = JSON.parse(_modlist.list);
				else if(req.params.filetype == "modlist")
					list = JSON.parse(_modlist.modlisttxt);
				else if(req.params.filetype == "ini")
					list = JSON.parse(_modlist.skyrimini);
				else if(req.params.filetype == "prefsini")
					list = JSON.parse(_modlist.skyrimprefsini);
				var markdown = "# Generated by Modwat.ch<br />";
				for(var i = 0; i < list.length; i++) {
					markdown += list[i]+"<br />";
				}
				res.send(markdown);
			} else {
				res.writeHead('404');
				res.end();
			}
		});
	});
	app.get('/json/:username', function(req, res) {
		Modlist.findOne({'username' : req.params.username}, function(err, _modlist) {
			if(_modlist) {
				res.send({"username": req.params.username, "mods": _modlist.list});
			} else {
				res.writeHead('404');
				res.end();
			}
		});
	});
	app.get('/reddit/:username', function(req, res) {
		Modlist.findOne({'username' : req.params.username}, function(err, _modlist) {
			if(_modlist) {
				var markdown = "# "+req.params.username+"  ";
				var list = JSON.parse(_modlist.list);
				for(var i = 0; i < list.length; i++) {
					markdown += (i+1)+". "+list[i]+"  ";
				}
				res.send(markdown);
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
	// COMMENT OUT, ONLY NEED 1 ADMIN FOR NOW
	/*app.post('/register', passport.authenticate('register', {
		successRedirect : '/admin',
		failureRedirect : '/'
	}));*/

	app.post('/usersearch', function(req, res) {
		res.redirect('/'+req.body.username);
	});
	app.post('/postnewblog', isLoggedIn, function(req, res) {
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
	});
	app.post('/loadorder', function(req, res) {

		//console.log(req.body.modlist);

		Modlist.findOne({'username' : req.body.username}, function(err, _modlist) {

			if(_modlist) { // if the username exists in the db
				if(_modlist.validPassword(req.body.password)) {
					_modlist.list = req.body.modlist;
					_modlist.save(function(err) {
						if(err) {

						} else {

						}
					});
					res.writeHead('200');
					res.end();
				}
				else {
					res.writeHead('403');
					res.end();
				}
			}
			else { // if the username does not exist

				var modlist = new Modlist();
				modlist.list = req.body.modlist;
				modlist.username = req.body.username;
				modlist.password = modlist.generateHash(req.body.password);

				modlist.save(function(err) {
					if(err) {
						res.writeHead('500');
						res.end();
						throw err;
					}
					else {
						res.writeHead('200');
						res.end();
					}
				});
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
					_modlist.save(function(err) {
						if(err) {

						} else {

						}
					});
					res.statusCode = 200;
					res.end();
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
				modlist.password = modlist.generateHash(req.body.password);

				modlist.save(function(err) {
					if(err) {
						res.statusCode = 500;
						console.error(err);
						res.write(err);
						res.end();
						throw err;
					}
					else {
						res.statusCode = 200;
						res.end();
					}
				});
			}
		});
	});
};

var Modlist = require('./models/modlist');
var Blog = require('./models/blog');
var Admin = require('./models/admin');

function isLoggedIn(req, res, next) {

	if(req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
}
