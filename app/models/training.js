var mongoose 				= require('mongoose'),
		Schema					= mongoose.Schema,
		TrainingSchema	= new Schema({
			'Store': Number,
			'Dept': Number,
			'Date': Number,
			'Weekly_Sales': Number,
			'IsHoliday': Boolean
		});

module.exports = mongoose.model('Training', TrainingSchema);