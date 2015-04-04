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

	app.get('/api/tests', function(request, response) {

		Test.find(function(err, tests) {

			if (err)
				response.send(err);

			response.json(tests);
		});
	});

	app.get('/api/tests/limit/:limit', function(request, response) {

		Test.find({}, {}, 
			{limit: request.params.limit}, function(err, tests) {

			if (err)
				response.send(err);
			response.json(tests);
		})
	})

	// Feature ==============================================

	app.get('/api/features', function(request, response) {

			Feature.find(function(err, features) {

				if (err)
					response.send(err);

				response.json(features);
			});
	});

	app.get('/api/features/limit/:limit', function(request, response) {

		Feature.find({}, {}, 
			{limit: request.params.limit}, function(err, features) {
			
			if (err)
				response.send(err);

			response.json(features);
		});

	});

	// Training =============================================

	app.get('/api/training', function(request, response) {

		Training.find(function(err, training) {
			
			if (err)
				response.send(err);
			response.json(training);
		});
	});

	app.get('/api/training/limit/:limit', function(request, response) {

		console.log("HERE");
		Training.find({}, {}, 
			{limit: request.params.limit}, function(err, training) {
			
			if (err)
				response.send(err);
			response.json(training)
		})
	})

	// Catch-All ============================================

	app.get('*', function(request, response) {
		response.sendfile('./public/index.html'); // load index
	});
}