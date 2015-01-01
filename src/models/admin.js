var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var adminSchema = new Schema({
	username: String,
	password: String
}, {
	collection: 'admin'
});

var adminSchemas = mongoose.model('admin', adminSchema);

adminSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

adminSchema.methods.validPassword = function(password) {

	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);