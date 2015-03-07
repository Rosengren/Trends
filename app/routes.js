var model = require('./models/model');

module.exports = function(app) {

	app.get('/api/models', function(request, response) {

		model.find(function(err, models) {

			if (err)
				response.send(err);

			response.json(models); // return all models in JSON format
		});
	});

	app.get('*', function(request, response) {
		response.sendfile('./public/index.html'); // load index
	});
}