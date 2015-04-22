var SVM = require('node-svm'),
		Promise = require('promise');

module.exports = {

	testAi: function(testData, trainingData, response) {

		var MILLIS_IN_A_DAY = 86400000.0;

		var formattedTrainData = [];
		var formattedTestData = [];

		trainingData.forEach(function(obj) {
			obj.Date.setFullYear(1970);
			var d = obj.Date.getTime() / MILLIS_IN_A_DAY;
			formattedTrainData.push([[d, obj.Store, obj.Dept], obj.Weekly_Sales]);
		});

		testData.forEach(function(obj) {
			obj.Date.setFullYear(1970);
			var d = obj.Date.getTime() / MILLIS_IN_A_DAY;
			formattedTestData.push([[d, obj.Store, obj.Dept], obj.Weekly_Sales]);
		});

		console.log("svm: data formatted...\nsvm: initializing classifier...");

		var clf = new SVM.SVM({
		    // svmType: 'NU_SVR'
		});
		 
		console.log("svm: training classifier...");

		var result = new Promise(function(resolve, reject) {
			clf.train(formattedTrainData).done(function () {

				console.log("svm: testing classifier...");

					var totalDistances = 0;
					var percentDistances = [0,0,0,0,0,0,0,0,0,0];
					var distances = [];

			    formattedTestData.forEach(function(ex){

			        var prediction = clf.predictSync(ex[0]);

			        console.log("Expected: " + ex[1] + " Prediction: " + prediction);

			        var distance = (Math.abs((prediction - ex[1]) / ex[1])) * 100
			        
			        totalDistances++;
			        if (distance < 100) {
			        	if (distance < 10) {
			        		percentDistances[0]++;
			        	} else {
			        		percentDistances[(''+distance)[0]]++;
			        	}
			        }

			        distances.push(distance);
			    });

	    		console.log("svm: percent Distances: " + percentDistances);
	    		resolve([totalDistances, percentDistances]);

			});
		});

		result.then(function(data) {
			console.log("svm: sending response: " + data);

			response.json(data);
		});
	}
}