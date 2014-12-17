var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var modlistSchema = new Schema({
	list: String, // deprecated
	modlisttxt: String, // deprecated
	skyrimini: String, // deprecated
	skyrimprefsini: String, // deprecated
	username: String,
	password: String,
	plugins: [],
	modlist: [],
	ini: [],
	prefsini: [],
	tags: [String],
	enb: String,
	game: String,
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

modlistSchema.methods.UpdateOldStyleModlist = function() {
	var tempOld = [];
	var tempNew = [];
	save = false;

	if(this.plugins.length < 1) {
		tempOld = this.list.split('\",\"');
		tempOld[0] = tempOld[0].substring(2);
		tempOld[tempOld.length-1] = tempOld[tempOld.length-1].substring(0,tempOld[tempOld.length-1].length-2);
		tempNew = [];
		for(var i = 0; i < tempOld.length; i++) {
			tempNew[i] = {"name":tempOld[i]};
		}
		this.plugins = tempNew;
		this.list = "";
		save = true;
	}
	if(this.modlist.length < 1) {
		tempOld = this.modlisttxt.split('\",\"');
		tempOld[0] = tempOld[0].substring(2);
		tempOld[tempOld.length-1] = tempOld[tempOld.length-1].substring(0,tempOld[tempOld.length-1].length-2);
		tempNew = [];
		for(var i = 0; i < tempOld.length; i++) {
			tempNew[i] = {"name":tempOld[i]};
		}
		this.modlist = tempNew;
		this.modlisttxt = "";
		save = true;
	}
	if(this.ini.length < 1) {
		tempOld = this.skyrimini.split('\",\"');
		tempOld[0] = tempOld[0].substring(2);
		tempOld[tempOld.length-1] = tempOld[tempOld.length-1].substring(0,tempOld[tempOld.length-1].length-2);
		tempNew = [];
		for(var i = 0; i < tempOld.length; i++) {
			tempNew[i] = {"name":tempOld[i]};
		}
		this.ini = tempNew;
		this.skyrimini = "";
		save = true;
	}
	if(this.prefsini.length < 1) {
		tempOld = this.skyrimprefsini.split('\",\"');
		tempOld[0] = tempOld[0].substring(2);
		tempOld[tempOld.length-1] = tempOld[tempOld.length-1].substring(0,tempOld[tempOld.length-1].length-2);
		tempNew = [];
		for(var i = 0; i < tempOld.length; i++) {
			tempNew[i] = {"name":tempOld[i]};
		}
		this.prefsini = tempNew;
		this.skyrimprefsini = "";
		save = true;
	}
	if(this.timestamp == null) {
		this.timestamp = new Date("7/10/2014");
		save = true;
	}
	if(save)
		this.save();
};

module.exports = mongoose.model('Modlist', modlistSchema);