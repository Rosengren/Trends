var mongoose 				= require('mongoose'),
		Schema					= mongoose.Schema,
		TrainingSchema	= new Schema({
			'Store': Number,
			'Dept': Number,
			'Date': String,
			'Weekly_Sales': Number,
			'IsHoliday': String
		});

module.exports = mongoose.model('Training', TrainingSchema);