module.exports = function(app) {

	var Modlist = require('./models/modlist');

	app.get('/', function(req, res) {
		res.sendfile('./views/index.html');
	});
	app.get('/:username', function(req, res) {
		Modlist.findOne({username: req.param("username")}, function(err, _lists) {
			if(!_lists) {
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
	app.post('/usersearch', function(req, res) {
		res.redirect('/'+req.body.username);
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
}


	/*


	if(_existing) {
						Modlist.findOneAndRemove({username: req.body.username}, function(err) {console.log(err);});

						var temp = req.body.modlist.split('&%#');
						for(var i = 0; i < temp.length; i++) {
							console.log(temp[i]);
						}

						var modlist = new Modlist({
							list: req.body.modlist,
							username: req.body.username
						});
						modlist.save(function(err) {
							if(err) {
								console.log(err);
								throw err;
							}
							else {
								console.log("success");
							}
						});
					}
					else {
						res.statusCode('403');
						res.end();
					}


					*/