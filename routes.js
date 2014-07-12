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
					lists : JSON.stringify(_lists.list),
					username: _lists.username,
					delimiter : '@#$'
				});
			}
		});
	});
	app.post('/usersearch', function(req, res) {
		res.redirect('/'+req.body.username);
	});
	app.post('/loadorder', function(req, res) {

		Modlist.findOne({'username' : req.body.username}, function(err, _modlist) {

			if(_modlist) { // if the username exists in the db
				if(_modlist.validPassword(req.body.password)) {
					console.log("Updated "+req.body.username+"'s Modlist Successfully");
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