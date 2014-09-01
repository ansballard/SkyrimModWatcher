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
					date: _blog.date.getMonth()+"/"+_blog.date.getDate()+"/"+_blog.date.getYear(),
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
			res.render('home.ejs', {
				title : _blog.title,
				author: _blog.author,
				thumbnailurl: _blog.thumbnail,
				date: _blog.date.getMonth()+"/"+_blog.date.getDate()+"/"+_blog.date.getYear(),
				content: _blog.body,
				login: false,
				admin: true
			});
		});
	});
	app.get('/login', function(req, res) {
		Blog.findOne({'newest': true}, function(err, _blog) {
			res.render('home.ejs', {
				title : _blog.title,
				author: _blog.author,
				thumbnailurl: _blog.thumbnail,
				date: _blog.date.getMonth()+"/"+_blog.date.getDate()+"/"+_blog.date.getYear(),
				content: _blog.body,
				login: true,
				admin: false
			});
		});
	});
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	app.get('/blog/:title', function(req, res) {
		Blog.findOne({'title': req.params.title}, function(err, _blog) {
			res.render('home.ejs', {
				title : _blog.title,
				author: _blog.author,
				thumbnailurl: _blog.thumbnail,
				date: _blog.date.parse(),
				content: _blog.body
			});
		});
	});
	// andonthethirdday,godcreated...
	app.get('/Peanut', function(req, res) {
		Modlist.findOne({username: "Peanut"}, function(err, _lists) {
			if(!_lists) {
				res.redirect('/');
			}
			else {
				if(_lists.length == 0) {
					_lists = "";
				}
				res.render('peanut.ejs', {
					list : _lists.list,
					username: _lists.username
				});
			}
		});
	});
	app.get('/:username', function(req, res) {
		Modlist.findOne({username: req.param("username")}, function(err, _lists) {
			if(!_lists) {
				console.log(" no lists for "+req.param("username"));
				res.redirect('/');
			}
			else {
				if(_lists.length == 0) {
					_lists = "";
				}
				res.render('index.ejs', {
					list : _lists.list,
					username: _lists.username
				});
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
		console.log(req.body.username);
		res.redirect('/'+req.body.username);
	});
	app.post('/postnewblog', isLoggedIn, function(req, res) {
		console.log("swag");
		var blog = new Blog();
		blog.title = req.body.title;
		blog.thumbnail = req.body.thumbnail;
		blog.body = req.body.content.replace(new RegExp('\r?\n','g'), '<br />');
		blog.author = req.body.author;
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

		console.log(req.body.modlist);

		Modlist.findOne({'username' : req.body.username}, function(err, _modlist) {

			if(_modlist) { // if the username exists in the db
				if(_modlist.validPassword(req.body.password)) {
					_modlist.list = req.body.modlist;
					_modlist.save(function(err) {
						if(err) {
							console.log('error on update');
						} else {
							console.log('Updated Successfully!');
						}
					});
					res.writeHead('200');
					res.end();
				}
				else {
					console.log("Wrong Password for "+req.body.username);
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
						console.log("Save Error: "+err);
						res.writeHead('500');
						res.end();
						throw err;
					}
					else {
						console.log("New Modlist Uploaded By "+req.body.username);
						res.writeHead('200');
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
		console.log("logged in as "+req.user.username);
		return next();
	}
	else {
		console.log("login redirect");
		res.redirect('/login');
	}
}