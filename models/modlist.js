var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var modlistSchema = new Schema({
	list: String,
	modlisttxt: String,
	skyrimini: String,
	skyrimprefsini: String,
	username: String,
	password: String,
	plugins: [{name: String, notes: String}],
	modlist: [{name: String, notes: String}],
	ini: [{name: String, notes: String}],
	prefsini: [{name: String, notes: String}],
	tags: [String],
	enb: String,
	timestamp: Date
}, {
	collection: 'modlist'
});

var modlistSchemas = mongoose.model('modlist', modlistSchema);

modlistSchema.methods.generateHash = function(_password) {
	return bcrypt.hashSync(_password, bcrypt.genSaltSync(8), null);
};

modlistSchema.methods.validPassword = function(_password) {
	return bcrypt.compareSync(_password, this.password);
};

modlistSchema.methods.convertFilesToArrays = function() {

	this.plugins = null;
	this.modlist = null;
	this.ini = null;
	this.prefsini = null;

	var temp = [];
	temp = this.list.split('\",\"');
	temp[0] = this.plugins[0].substring(2,this.plugins[0].length);

	for(var i = 0; i < temp.length; i++) {
		this.plugins[i].name = temp[i];
	}
	this.plugins = this.list.split('\",\"');
	this.plugins[0] = this.plugins[0].substring(2,this.plugins[0].length);
	this.plugins[this.plugins.length-1] = this.plugins[this.plugins.length-1].substring(0,this.plugins[this.plugins.length-1].length-2);

	this.modlist = this.modlisttxt.split('\",\"');
	this.modlist[0] = this.modlist[0].substring(2,this.modlist[0].length);
	this.modlist[this.modlist.length-1] = this.modlist[this.modlist.length-1].substring(0,this.modlist[this.modlist.length-1].length-2);

	this.ini = this.skyrimini.split('\",\"');
	this.ini[0] = this.ini[0].substring(2,this.ini[0].length);
	this.ini[this.ini.length-1] = this.ini[this.ini.length-1].substring(0,this.ini[this.ini.length-1].length-2);

	this.prefsini = this.skyrimprefsini.split('\",\"');
	this.prefsini[0] = this.prefsini[0].substring(2,this.prefsini[0].length);
	this.prefsini[this.prefsini.length-1] = this.prefsini[this.prefsini.length-1].substring(0,this.prefsini[this.prefsini.length-1].length-2);

	this.save();
	return true;
};

module.exports = mongoose.model('Modlist', modlistSchema);