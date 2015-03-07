var Store 		= require('./models/store'),
		Test			= require('./models/test'),
		Feature 	= require('./models/feature'),
		Training 	= require('./models/training');

module.exports = function(app) {

	// Store ================================================

	app.get('/api/stores', function(request, response) {

		Store.find(function(err, stores) {

			if (err)
				response.send(err);

			response.json(stores);
		});
	});

	// Test =================================================

	app.get('/api/test', function(request, response) {

		Store.find(function(err, stores) {

			if (err)
				response.send(err);

			response.json(stores);
		});
	});

	// Feature ==============================================

	app.get('/api/features', function(request, response) {

			Feature.find(function(err, features) {

				if (err)
					response.send(err);

				response.json(features);
			});
	});

	// Training =============================================

	app.get('/api/train', function(request, response) {

		Training.find(function(err, features) {

			if (err)
				response.send(err);

			response.json(train);
		});
	});

	app.get('*', function(request, response) {
		response.sendfile('./public/index.html'); // load index
	});
}