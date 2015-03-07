var mongoose 		= require('mongoose'),
		Schema			= mongoose.Schema,
		TestSchema	= new Schema({
			'Store': Number,
			'Dept': Number,
			'Date': 'String',
			'IsHoliday': 'String'
		});

module.exports = mongoose.model('Test', TestSchema);