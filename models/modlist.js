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
	if(this.modlist.length < 1 && this.modlisttxt != "[]") {
		tempOld = this.modlisttxt.split('\",\"');
		tempOld[0] = tempOld[0].substring(2);
		tempOld[tempOld.length-1] = tempOld[tempOld.length-1].substring(0,tempOld[tempOld.length-1].length-2);
		tempNew = [];
		for(var i = 0; i < tempOld.length; i++) {
			tempNew[i] = {"name":tempOld[i]};
		}
		if(tempNew[0].name == "") {
			this.modlist = [];
		} else {
			this.modlist = tempNew;
		}
		this.modlisttxt = "";
		save = true;
	}
	if(this.ini.length < 1 && this.skyrimini != "[]") {
		tempOld = this.skyrimini.split('\",\"');
		tempOld[0] = tempOld[0].substring(2);
		tempOld[tempOld.length-1] = tempOld[tempOld.length-1].substring(0,tempOld[tempOld.length-1].length-2);
		tempNew = [];
		for(var i = 0; i < tempOld.length; i++) {
			tempNew[i] = {"name":tempOld[i]};
		}
		if(tempNew[0].name == "") {
			this.ini = [];
		} else {
			this.ini = tempNew;
		}
		this.skyrimini = "";
		save = true;
	}
	if(this.prefsini.length < 1 && this.skyrimprefsini != "[]") {
		tempOld = this.skyrimprefsini.split('\",\"');
		tempOld[0] = tempOld[0].substring(2);
		tempOld[tempOld.length-1] = tempOld[tempOld.length-1].substring(0,tempOld[tempOld.length-1].length-2);
		tempNew = [];
		for(var i = 0; i < tempOld.length; i++) {
			tempNew[i] = {"name":tempOld[i]};
		}
		if(tempNew[0].name == "") {
			this.prefsini = [];
		} else {
			this.prefsini = tempNew;
		}
		this.skyrimprefsini = "";
		save = true;
	}
	if(this.timestamp == null) {
		this.timestamp = new Date("7/10/2014");
		save = true;
	}
	if(this.game == null) {
		this.game = "skyrim";
		save = true;
	}
	if(save)
		this.save();
};

modlistSchema.methods.GetGPU = function() {
	var _gpu = '';
	for(var i = 0; i < this.prefsini.length; i++) {
		if(this.prefsini[i].name.indexOf('sD3DDevice') >= 0) {
			gpu = this.prefsini[i].name.split('=')[1].trim();
			if (gpu.indexOf(';') >= 0 || gpu.indexOf('//') >= 0) {
				return 0;
			} else {
				return gpu.substr(1,gpu.length-2).trim();
			}
		}
	}
	return 0;
}

module.exports = mongoose.model('Modlist', modlistSchema);