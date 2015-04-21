angular.module('comparisonController', ['ngMaterial'])
.controller('comparisonController', ['$scope', '$http', '$log', '$q', function($scope, $http, $log, $q) {
	const QUERY_LIMIT = 10000;
	const ADJUSTED_YEAR = 1970; // Used to combine multiple years on one slope. Only interested in yearly sales
	const MILLIS_IN_A_DAY = 86400000;
	const K_VALUE = 3;

  $scope.timeout = 100;

	$scope.pageTitle = "Comparison";
	$scope.aiTests = {"svmTest": "Support Vector Machine", "lrTest": "Linear Regression", "rfTest": "Random Forest", "knnTest": "K-Nearest Neighbor"};


	$scope.testAiMethod = function(testFunction) {

		var testData = [];
		$http.get('/api/tests/limit/' + QUERY_LIMIT)
			.success(function(data) {
				testData = data.map(function(d) {
					return {store: d.Store, department: d.Dept, date: (new Date(d.Date)).getTime(), sales :d.Weekly_Sales};
				});

				testFunction(testData);
		})
		.error(function(data) {
		 	console.log('Error: ' + data);
		});

	}

	$scope.getLinearRegressionModel = function() {

		var deferred = $q.defer();

		$http.get('/api/regression/limit/' + QUERY_LIMIT)
		.success(function(data) {

			// Split data into separate Stores and Departments
			var organized = {};

			for (var i = 0; i < data.length; i++) {

				if (organized[data[i].Store + "_" + data[i].Dept] !== undefined) {
					organized[data[i].Store + "_" + data[i].Dept].push({'Date': data[i].Date, Weekly_Sales: data[i].Weekly_Sales});
				} else {
					organized[data[i].Store + "_" + data[i].Dept] = [{'Date': data[i].Date, Weekly_Sales: data[i].Weekly_Sales}];
				}
			}

			var model = [];
			for (var name in organized) {

				model[name] = ss.linear_regression()
					.data(organized[name].map(function(d) {
						var date = new Date(d.Date);
						date.setFullYear(ADJUSTED_YEAR);
						return [date.getTime(), d.Weekly_Sales];
					})).line();

			}


			deferred.resolve(model);

		})
		.error(function(data) {
			console.log("Error: " + data);
			deferred.reject("Error: " + data);
		});

		return deferred.promise;
	}


	var testLinearRegression = function(testData) {

		var p = $scope.getLinearRegressionModel();
		p.then(function(resolve) {

			var distances = [];
			var adjustedDistances = [];
			for (var i = 0; i < testData.length; i++) {
				var adjustedDate = new Date(testData[i].date);
				adjustedDate.setFullYear(ADJUSTED_YEAR);
				adjustedDate = adjustedDate.getTime();

				var line = resolve[testData[i].store + '_' + testData[i].department];

				if (line !== undefined) {
					var prediction = line(adjustedDate);
					var distance = (Math.abs(prediction - testData[i].sales)) / Math.max(testData[i].sales) * 100; // / (prediction + testData[i].sales) * 100;


					if (testData[i].sales > 5000)
						adjustedDistances.push(distance);

					distances.push(distance);
				}
			}

			var Error = ss.sum(distances) / distances.length;
			console.log("LR % Error: " + Error + "%");


			// Since some departments make very small amounts of money on specific days,
			// the error becomes massive
			var adjustedError = ss.sum(adjustedDistances) / adjustedDistances.length;
			console.log("LR Adjusted % Error: " + adjustedError + "%");

		});
	}

	$scope.getKNearestRegressionModel = function() {

		var deferred = $q.defer();

		$http.get('/api/regression/limit/' + QUERY_LIMIT)
		.success(function(data) {

			// Split data into separate Stores and Departments
			var organizedData = {};

			for (var i = 0; i < data.length; i++) {

				if (organizedData[data[i].Store + "_" + data[i].Dept] !== undefined) {
					organizedData[data[i].Store + "_" + data[i].Dept].push({'Date': data[i].Date, Weekly_Sales: data[i].Weekly_Sales});
				} else {
					organizedData[data[i].Store + "_" + data[i].Dept] = [{'Date': data[i].Date, Weekly_Sales: data[i].Weekly_Sales}];
				}
			}

			kNN.setKValue(K_VALUE);
			kNN.train(organizedData);

			deferred.resolve(kNN);

		})
		.error(function(data) {
			console.log("Error: " + data);
			deferred.reject("Error: " + data);
		});

		return deferred.promise;
	}

	testKNNRegression = function(testData) {

		var p = $scope.getKNearestRegressionModel();
		p.then(function(resolve) {

			var totalDistances = 0;
			var percentDistances = [0,0,0,0,0,0,0,0,0,0];

			var distances = [];
			for (var i = 0; i < testData.length; i++) {

				var prediction = resolve.predict(testData[i].store, testData[i].department, testData[i].date);

				if (prediction == -1) {
					continue; // Safe Guard for when testing with smaller data sets
				}

				var distance = (Math.abs((prediction - testData[i].sales) / testData[i].sales)) * 100

				totalDistances++;
				if (distance < 100) {
					if (distance < 10) {
						percentDistances[1]++;
					} else {
						percentDistances[(''+distance)[0]]++;
					}
				}

				// console.log("prediction: " + prediction + " test: " + testData[i].sales + " distance: " + distance + " on date: " + (new Date(testData[i].date)).toISOString() + " for department: " + testData[i].department + " store: " + testData[i].store);
				distances.push(distance);
			}
			console.log(percentDistances);
			console.log(ss.sum(percentDistances));// >> MAKE THIS VISIBLE
		
		});
	}

	testKNNRegression = function(testData) {

		var p = $scope.getKNearestRegressionModel();
		p.then(function(resolve) {

			var totalDistances = 0;
			var percentDistances = [0,0,0,0,0,0,0,0,0,0];

			var distances = [];
			for (var i = 0; i < testData.length; i++) {

				var prediction = resolve.predict(testData[i].store, testData[i].department, testData[i].date);

				if (prediction == -1) {
					continue; // Safe Guard for when testing with smaller data sets
				}

				var distance = (Math.abs((prediction - testData[i].sales) / testData[i].sales)) * 100

				totalDistances++;
				if (distance < 100) {
					if (distance < 10) {
						percentDistances[1]++;
					} else {
						percentDistances[(''+distance)[0]]++;
					}
				}

				// console.log("prediction: " + prediction + " test: " + testData[i].sales + " distance: " + distance + " on date: " + (new Date(testData[i].date)).toISOString() + " for department: " + testData[i].department + " store: " + testData[i].store);
				distances.push(distance);
			}
			console.log(percentDistances);
			console.log(ss.sum(percentDistances));// >> MAKE THIS VISIBLE
		
		});
	}

  function httpRequestHandler () {
      var timeout = $q.defer(),
          result = $q.defer(),
          timedOut = false,
          httpRequest;
      
      setTimeout(function () {
          timedOut = true;
          timeout.resolve();
      }, (1000 * $scope.timeout));
      
      httpRequest = $http({
          // method : 'post',
          url: $scope.setURL,
          cache: false,
          timeout: timeout.promise
      });
      
      httpRequest.success(function(data, status, headers, config) {
          result.resolve(data);
      });

		httpRequest.error(function(data, status, headers, config) {
          if (timedOut) {
              result.reject({
                  error: 'timeout',
                  message: 'Request took longer than ' + $scope.timeout + ' seconds.'
          });
          } else {
              result.reject(data);
          }
      });
      
     return result.promise;
  }
  
  $scope.testRandomForest = function () {
		$scope.setURL = '/api/randomForest';
    console.log('Requesting');
    $scope.response = '';
    
    var httpRequest = httpRequestHandler();
    
    httpRequest.then(function (data) {
        console.log('Complete');
        console.log(data);
    
    }, function (error) {
        console.log('Error');
        $scope.response = error;            
    });
  };

 
  $scope.testSVM = function () {
  	$scope.setURL = '/api/svm';
    console.log('Requesting');
    $scope.response = '';
    
    var httpRequest = httpRequestHandler();
    
    httpRequest.then(function (data) {
        console.log('Complete');
        console.log(data);
    
    }, function (error) {
        console.log('Error');
        $scope.response = error;            
    });
  };


   
	// $scope.testRandomForest = function() {

	// 	// var deferred = $q.defer();

	// 	$http.get('/api/randomForest')
	// 	.success(function(data) {

	// 		console.log(data);
	// 		// deferred.resolve(kNN);

	// 	})
	// 	.error(function(data) {
	// 		console.log("Error: " + data);
	// 		// deferred.reject("Error: " + data);
	// 	});

	// 	// return deferred.promise;
	// }

	// $scope.testRandomForest();
	$scope.testSVM();


	// $scope.testAiMethod(test)
	// $scope.testAiMethod(testKNNRegression); // ADD THIS TO BUTTON
	// $scope.testAiMethod(testLinearRegression); // ADD THIS TO BUTTON

	// var data = [[0,0], [0,1], [1,0], [1,1]];
	// var labels = ['a', 'b', 'c', 'd'];
	// var svm = new svmjs.SVM();
	// svm.train(data, labels, {C: 1.0}); // C is a parameter to SVM
	// var testlabels = svm.predict([0, 1.5]);
	// console.log(testlabels);


}]);