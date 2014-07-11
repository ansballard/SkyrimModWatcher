
/*
 * POST load order
 */

exports.loadorder = function(req, res){
	fs.writeFile('./loadorders/lo.txt', function(err) {});
	console.log(req.body);
	res.send(req.body);
};