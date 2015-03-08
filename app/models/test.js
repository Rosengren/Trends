var mongoose 		= require('mongoose'),
		Schema			= mongoose.Schema,
		TestSchema	= new Schema({
			'Store': Number,
			'Dept': Number,
			'Date': Date,
			'IsHoliday': Boolean
		});

module.exports = mongoose.model('Test', TestSchema);