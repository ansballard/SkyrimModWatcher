module.exports = function(app, cors, corsOptions) {

  /**
   *  Will need routes for option on each when token auth comes in
   */

	app.get('/api/users/count', cors(corsOptions), function(req, res) {
		Modlist.find({}, {_id:1}, function(err, _modlists) {
			if(_modlists) {
				res.set('Content-Type','text/plain');
				res.send(''+_modlists.length);
			} else {
				res.writeHead(404);
				res.end();
			}
		});
	});
	app.get('/api/users/list', cors(corsOptions), function(req, res) {
		Modlist.find({}, {username:1}, function(err, _mods) {
			var mods_ = [];
			for(var i = _mods.length-1, j = 0; i >= 0; i--, j++) {
				mods_[j] = _mods[i].username;
			}
			res.set('Content-Type','text/json');
			res.send({"usernames":mods_});
		});
	});
	app.get('/api/script/version', cors(corsOptions), function(req, res) {
		res.set('Content-Type','text');
		res.send(scriptVersion);
	});
	app.get('/api/user/:username/plugins', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.params.username}, {plugins:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.plugins));
			}
		});
	});
	app.get('/api/user/:username/modlist', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.params.username}, {modlist:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.modlist));
			}
		});
	});
	app.get('/api/user/:username/ini', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.params.username}, {ini:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.ini));
			}
		});
	});
	app.get('/api/user/:username/prefsini', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.params.username}, {prefsini:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.prefsini));
			}
		});
	});
	app.get('/api/user/:username/skse', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.params.username}, {skse:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.skse));
			}
		});
	});
	app.get('/api/user/:username/enblocal', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.params.username}, {enblocal:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.enblocal));
			}
		});
	});
	app.get('/api/user/:username/profile', cors(corsOptions), function(req, res) {
	  Modlist.findOne({username: req.params.username}, {tag:1,enb:1,badge:1,timestamp:1,game:1,_id:0}, function(err, _list) {
	    if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(_list));
			}
	  });
	});
	app.get('/api/user/:username/files', cors(corsOptions), function(req, res) {
	  Modlist.findOne({username: req.params.username}, {plugins:1,modlist:1,ini:1,prefsini:1,skse:1,enblocal:1,_id:0}, function(err, _list) {
	    if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');
				var _arr = [];
				if(_list.plugins.length > 0) {
				  _arr.push("plugins");
				} if(_list.modlist.length > 0) {
				  _arr.push("modlist");
				} if(_list.ini.length > 0) {
				  _arr.push("ini");
				} if(_list.prefsini.length > 0) {
				  _arr.push("prefsini");
				} if(_list.skse.length > 0) {
				  _arr.push("skse");
				} if(_list.enblocal.length > 0) {
				  _arr.push("enblocal");
				}
				res.end(JSON.stringify(_arr));
			}
	  });
	});

	app.post('/loadorder', cors(corsOptions), function(req, res) {
		Modlist.findOne({'username' : req.body.username}, function(err, _modlist) {
			if(_modlist) { // if the username exists in the db
				if(_modlist.validPassword(req.body.password)) {
					//_modlist.UpdateOldStyleModlist();
					console.log('password valid');
					_modlist.list = '';
					_modlist.modlisttxt = '';
					_modlist.skyrimini = '';
					_modlist.skyrimprefsini = '';

					_modlist.plugins = req.body.plugins;
					_modlist.modlist = req.body.modlist;
					_modlist.ini = req.body.ini;
					_modlist.prefsini = req.body.prefsini;
					_modlist.skse = req.body.skse;
					_modlist.enblocal = req.body.enblocal;
					_modlist.enb = req.body.enb;
					_modlist.game = req.body.game;
					_modlist.tag = req.body.tag;
					_modlist.timestamp = Date.now();
					_modlist.save(function(err) {
						if(err) {
							res.statusCode = 500;
							console.log(err);
							res.write(err);
							res.end();
							throw err;
						} else {
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
				modlist.skse = req.body.skse;
				modlist.enblocal = req.body.enblocal;
				modlist.enb = req.body.enb;
				modlist.game = req.body.game;
				modlist.tag = req.body.tag;
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
};

//var Blog = require('./public/models/blog.min.js');
var Modlist = require('./public/models/modlist.min.js');