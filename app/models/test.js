var mongoose 		= require('mongoose'),
		Schema			= mongoose.Schema,
		TestSchema	= new Schema({
			'Store': Number,
			'Dept': Number,
			'Date': Date,
			'IsHoliday': Boolean,
			'Weekly_Sales': Number
		});

module.exports = mongoose.model('Test', TestSchema);