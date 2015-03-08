var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		FeatureSchema = new Schema({
			'Store': Number,
			'Date': Date,
			'Temperature': Number,
			'Fuel_Price': Number,
			'MarkDown1': String,
			'MarkDown2': String,
			'MarkDown3': String,
			'MarkDown4': String,
			'MarkDown5': String,
			'CPI': Number,
			'Unemployment': Number,
			'IsHoliday': Boolean

		});

module.exports = mongoose.model('Feature', FeatureSchema);