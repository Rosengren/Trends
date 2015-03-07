var Model 	= require('./models/model'),
		Store 	= require('./models/store'),
		Feature = require('./models/feature');

module.exports = function(app) {

	app.get('/api/models', function(request, response) {

		Model.find(function(err, models) {

			if (err)
				response.send(err);

			response.json(models); // return all models in JSON format
		});
	});

	app.get('/api/stores', function(request, response) {

		Store.find(function(err, stores) {
			// response.json({"message": "GOT HERE!"});

			if (err)
				response.send(err);

			response.json(stores);
		});
	});

	app.get('/api/stores', function(request, response) {

		Store.find(function(err, stores) {
			response.json({"message": "GOT HERE!"});

			if (err)
				response.send(err);

			response.json(stores);
		});
	});

	app.get('/api/features', function(request, response) {

			Feature.find(function(err, features) {
				// response.json({"message": "GOT HERE TOO!"});

				if (err)
					response.send(err);

				response.json(features);
			})
	})

	app.get('*', function(request, response) {
		response.sendfile('./public/index.html'); // load index
	});
}