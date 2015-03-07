var mongoose 		= require('mongoose'),
		Schema			= mongoose.Schema,
		StoreSchema = new Schema({
			'Store': Number,
			'Type': String,
			'Size': Number
		});

module.exports = mongoose.model('Store', StoreSchema);