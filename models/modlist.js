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
	plugins: [String],
	modlist: [String],
	ini: [String],
	prefsini: [String],
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

modlistSchema.methods.overwriteList = function() {

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

	/*console.log('\n\nplugins.txt --\n\n')
	for(var i = 0; i < this.plugins.length; i++) {
		console.log(this.plugins[i]);
	}
	console.log('\n\nmodlist.txt --\n\n')
	for(var i = 0; i < this.modlist.length; i++) {
		console.log(this.modlist[i]);
	}
	console.log('\n\nskyrim.ini --\n\n')
	for(var i = 0; i < this.ini.length; i++) {
		console.log(this.ini[i]);
	}
	console.log('\n\nskyrimprefs.ini --\n\n')
	for(var i = 0; i < this.prefsini.length; i++) {
		console.log(this.prefsini[i]);
	}*/

	this.save();
	return true;
};

module.exports = mongoose.model('Modlist', modlistSchema);