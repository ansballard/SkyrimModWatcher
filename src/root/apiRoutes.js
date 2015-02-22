module.exports = function(app, cors, corsOptions) {

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
	/**
	 *  Routes can be optimized if they're split by filename
	 */
	app.get('/api/:username/plugins', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.param("username")}, {plugins:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.plugins));
			}
		});
	});
	app.get('/api/:username/modlist', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.param("username")}, {modlist:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.modlist));
			}
		});
	});
	app.get('/api/:username/ini', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.param("username")}, {ini:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.ini));
			}
		});
	});
	app.get('/api/:username/prefsini', cors(corsOptions), function(req, res) {
		Modlist.findOne({username: req.param("username")}, {prefsini:1}, function(err, _list) {
			if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');

				res.end(JSON.stringify(_list.prefsini));
			}
		});
	});
	app.get('/api/:username/profile', cors(corsOptions), function(req, res) {
	  Modlist.findOne({username: req.param("username")}, {tag:1,enb:1,badge:1,timestamp:1,game:1,_id:0}, function(err, _list) {
	    if(!_list) {
				res.writeHead(404);
				res.end();
			} else {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(_list));
			}
	  });
	});
	app.get('/api/:username/files', cors(corsOptions), function(req, res) {
	  Modlist.findOne({username: req.param("username")}, {plugins:1,modlist:1,ini:1,prefsini:1,_id:0}, function(err, _list) {
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
				}
				res.end(JSON.stringify(_arr));
			}
	  });
	});
};

//var Blog = require('./public/models/blog.min.js');
var Modlist = require('./public/models/modlist.min.js');