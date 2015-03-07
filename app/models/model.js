// TODO: update this when data models 
// have been designed for the sales data

var mongoose = require('mongoose');

module.exports = mongoose.model('Model', {
	name : {
		type : String,
		default: ''
	}
});