var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var blogSchema = new Schema({
	thumbnail: String,
	title: String,
	body: String,
	desc: String,
	date: { type: Date, default: Date.now },
	author: String,
	newest: { type: Boolean, default: true },
	unique: String
}, {
	collection: 'blog'
});

var blogSchemas = mongoose.model('blog', blogSchema);

module.exports = mongoose.model('Blog', blogSchema);