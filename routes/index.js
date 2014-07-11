
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.sendfile('./views/index.html', { title: 'Express' });
};