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
	skse: [],
	enblocal: [],
	tag: String,
	enb: String,
	game: String,
	pic: String,
	badge: String,
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

// Overwrites new style with updated old style data, will fix after
// logic for merging works correctly
modlistSchema.methods.UpdateOldStyleModlist = function() {
	var tempOld = [];
	var tempNew = [];
	save = false;

	if(this.list != "[]" || (this.plugins.length > 0 && this.list == "[]")) {
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
	if(this.modlisttxt != "[]" || (this.modlist.length > 0 && this.modlisttxt == "[]")) {
		if(this.modlisttxt == undefined) {
			this.modlist = [];
		} else {
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
		}
		save = true;
	}
	if(this.skyrimini != "[]" || (this.ini.length > 0 && this.ini == "[]")) {
		if(this.skyrimini == undefined) {
			this.ini = [];
		} else {
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
		}
		save = true;
	}
	if(this.skyrimprefsini != "[]" || (this.prefsini.length > 0 && this.prefsini == "[]")) {
		if(this.skyrimprefsini == undefined) {
			this.prefsini = [];
		} else {
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
		}
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
	if(this.plugins.length < 1) {
		this.UpdateOldStyleModlist();
	}
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