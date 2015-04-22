var Store 		= require('./models/store'),
		Test			= require('./models/test'),
		Feature 	= require('./models/feature'),
		Training 	= require('./models/training'),
		Promise		= require('promise'),
		fs = require('fs'),

		RandomForest = require('./randomForest'),
		SVM = require('./svm');

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
	});


	app.get('/api/tests/limit/:limit/store/:store/dept/:dept', function(request, response) {

		Test.find({Store: request.params.store, Dept: request.params.dept}, 
								 {_id:0, 'Dept':1, 'Date':1, 'Store': 1, 'Weekly_Sales': 1}, 
								 {limit: request.params.limit}, function(err, tests) {
			if (err)
				response.send(err);
			response.json(tests);
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

		Training.find({}, {}, 
			{limit: request.params.limit}, function(err, training) {
			
			if (err)
				response.send(err);
			response.json(training)
		});
	});

	// Regression ===========================================

	app.get('/api/regression/limit/:limit', function(request, response) {

		Training.find({}, 
								 {_id:0, 'Dept':1, 'Date':1, 'Store': 1, 'Weekly_Sales': 1},
								 {limit: request.params.limit}, function(err, training) {
			if (err)
				response.send(err);
			response.json(training);
		});

	});

	app.get('/api/regression/limit/:limit/store/:store/dept/:dept', function(request, response) {

		Training.find({Store: request.params.store, Dept: request.params.dept}, 
								 {_id:0, 'Dept':1, 'Date':1, 'Store': 1, 'Weekly_Sales': 1}, 
								 {limit: request.params.limit}, function(err, training) {
			if (err)
				response.send(err);
			response.json(training);
		});

	});

	app.get('/api/regression/limit/:limit/store/:store/dept/:dept/start/:startDate/end/:endDate', function(request, response) {

		Training.find({Store: request.params.store, Dept: request.params.dept, 
									"Date": { 
										"$gte" : new Date(request.params.startDate), 
										"$lte": new Date(request.params.endDate)
									}}, 
								 {_id:0, 'Dept':1, 'Date':1, 'Store': 1, 'Weekly_Sales': 1}, 
								 {limit: request.params.limit}, function(err, training) {

			if (err)
				response.send(err);
			response.json(training);
		});

	});

	app.get('/api/regression/limit/:limit/start/:startDate/end/:endDate', function(request, response) {

		Training.find({Store: request.params.store, Dept: request.params.dept, 
									"Date": { 
										"$gte" : new Date(request.params.startDate), 
										"$lte": new Date(request.params.endDate)
									}}, 
								 {_id:0, 'Dept':1, 'Date':1, 'Store': 1, 'Weekly_Sales': 1}, 
								 {limit: request.params.limit}, function(err, training) {

			if (err)
				response.send(err);
			response.json(training);
		});

	});


	// Random Forest ========================================

	app.get('/api/randomForest/testlimit/:testLimit/trainlimit/:trainLimit', function(request, response) {

		var getTrainingData = new Promise(function(resolve, reject) {

			Training.find({}, 
									 {_id:0, 'Dept':1, 'Date':1, 'Store': 1, 'Weekly_Sales': 1},
									 {limit: request.params.trainLimit}, function(err, training) {
				if (err) {
					reject(err);
				} else {
					resolve(training);
				}
			});
		});


		var getTestingData = new Promise(function(resolve, reject) {

			Test.find({}, 
							 {_id:0, 'Dept':1, 'Date':1, 'Store': 1, 'Weekly_Sales': 1},
							 {limit: request.params.testLimit}, function(err, testing) {

				if (err) {
					reject(err);	
				} else {
					resolve(testing);
				}
				
			});
		});

		Promise.all([getTestingData, getTrainingData])
			.then(function(data) {
				RandomForest.testAi(data[0], data[1], response);
			});

	});

	// SVM ==================================================

	app.get('/api/svm/testlimit/:testLimit/trainlimit/:trainLimit', function(request, response) {

		var getTrainingData = new Promise(function(resolve, reject) {

			Training.find({}, 
									 {_id:0, 'Dept':1, 'Date':1, 'Store': 1, 'Weekly_Sales': 1},
									 {limit: request.params.trainLimit}, function(err, training) {
				if (err) {
					reject(err);
				} else {
					resolve(training);
				}
			});
		});


		var getTestingData = new Promise(function(resolve, reject) {

			Test.find({}, 
							 {_id:0, 'Dept':1, 'Date':1, 'Store': 1, 'Weekly_Sales': 1},
							 {limit: request.params.testLimit}, function(err, testing) {

				if (err) {
					reject(err);	
				} else {
					resolve(testing);
				}
				
			});
		});

		Promise.all([getTestingData, getTrainingData])
			.then(function(data) {
				SVM.testAi(data[0], data[1], response);
			});



	})

	// Catch-All ============================================

	app.get('*', function(request, response) {
		response.sendfile('./public/index.html'); // load index
	});
}