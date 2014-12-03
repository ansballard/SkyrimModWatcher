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

modlistSchema.methods.overwriteList = function(_list) {

	return true;
};

module.exports = mongoose.model('Modlist', modlistSchema);