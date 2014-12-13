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

	/*this.plugins = [{"name": "", "notes": ""}];
	this.modlist = [{"name": "", "notes": ""}];
	this.ini = [{"name": "", "notes": ""}];
	this.prefsini = [{"name": "", "notes": ""}];*/

	console.log(this.list);
	this.skyrimini = "swaggg";

	var temp = [];
	temp = this.list.split('\",\"');
	temp[0] = temp[0].substring(2,temp[0].length);

	for(var i = 0; i < temp.length; i++) {
		this.plugins[i] = {"name":temp[i],"notes":""};
	}

	temp = this.modlisttxt.split('\",\"');
	temp[0] = temp[0].substring(2,temp[0].length);

	for(var i = 0; i < temp.length; i++) {
		this.modlist[i] = {"name":temp[i],"notes":""};
	}

	temp = this.skyrimini.split('\",\"');
	temp[0] = temp[0].substring(2,temp[0].length);

	for(var i = 0; i < temp.length; i++) {
		this.ini[i] = {"name":temp[i],"notes":""};
	}

	temp = this.skyrimprefsini.split('\",\"');
	temp[0] = temp[0].substring(2,temp[0].length);

	for(var i = 0; i < temp.length; i++) {
		this.prefsini[i] = {"name":temp[i],"notes":""};
	}

	return true;
};

module.exports = mongoose.model('Modlist', modlistSchema);