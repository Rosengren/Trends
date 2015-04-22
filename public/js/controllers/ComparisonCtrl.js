angular.module('comparisonController', ['ngMaterial'])
.controller('comparisonController', ['$scope', '$http', '$log', '$q', function($scope, $http, $log, $q) {
	const ADJUSTED_YEAR = 1970; // Used to combine multiple years on one slope. Only interested in yearly sales
	const MILLIS_IN_A_DAY = 86400000;
	const K_VALUE = 3;

	const SVM_TEST_LIMIT = 20;
	const SVM_TRAIN_LIMIT = 100;

  $scope.timeout = 100;

	$scope.pageTitle = "Comparison";
	$scope.aiTests = {
	  "svmTest": {
	    "name": "Support Vector Machine",
	    "testSize": 0,
	    "trainSize": 0,
	    "percentDistances": [],
	    "within100":0,
	    "trainLimit": 1000,
	    "testLimit": 20
	  },
	  "lrTest": {
	    "name": "Linear Regression",
	    "testSize": 0,
	    "trainSize": 0,
	    "percentDistances": [],
	    "within100":0,
	    "trainLimit": 10000,
	    "testLimit": 100
	  },
	  "rfTest": {
	    "name": "Random Forest",
	    "testSize": 0,
	    "trainSize": 0,
	    "percentDistances": [],
	    "within100":0,
	    "trainLimit": 10,
	    "testLimit": 2
	  },
	  "knnTest": {
	    "name": "K-Nearest Neighbor",
	    "testSize": 10,
	    "trainSize": 100,
	    "percentDistances": [],
	    "within100":0,
	    "trainLimit": 10000,
	    "testLimit": 1000
	  }
	}


	$scope.testAiMethod = function(testFunction, aiName) {

		var testData = [];
		$http.get('/api/tests/limit/' + $scope.aiTests[aiName].testLimit)
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

		$http.get('/api/regression/limit/' + $scope.aiTests['lrTest'].trainLimit)
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

			$scope.aiTests['lrTest'].trainSize = data.length;

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

			var totalDistances = 0;
			var percentDistances = [0,0,0,0,0,0,0,0,0,0];

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

					totalDistances++;
					if (distance < 100) {
						if (distance < 10) {
							percentDistances[0]++;
						} else {
							percentDistances[(''+distance)[0]]++;
						}
					}
					
				}
			}

			var Error = ss.sum(distances) / distances.length;
			console.log("LR % Error: " + Error + "%");


			// Since some departments make very small amounts of money on specific days,
			// the error becomes massive
			var adjustedError = ss.sum(adjustedDistances) / adjustedDistances.length;
			console.log("LR Adjusted % Error: " + adjustedError + "%");

			console.log(percentDistances);
			console.log(ss.sum(percentDistances));
			$scope.displayResults(totalDistances, percentDistances, ss.sum(percentDistances), 'lrTest');
		});
	}

	$scope.getKNearestRegressionModel = function() {

		var deferred = $q.defer();

		$http.get('/api/regression/limit/' + $scope.aiTests['knnTest'].trainLimit)
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

			$scope.aiTests['knnTest'].trainSize = data.length;
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
						percentDistances[0]++;
					} else {
						percentDistances[(''+distance)[0]]++;
					}
				}

				// console.log("prediction: " + prediction + " test: " + testData[i].sales + " distance: " + distance + " on date: " + (new Date(testData[i].date)).toISOString() + " for department: " + testData[i].department + " store: " + testData[i].store);
				distances.push(distance);
			}
			console.log(percentDistances);
			console.log(ss.sum(percentDistances));
			$scope.displayResults(totalDistances, percentDistances, ss.sum(percentDistances), 'knnTest');
		
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
		$scope.setURL = '/api/randomForest/testlimit/' + $scope.aiTests['rfTest'].testLimit + 
		'/trainlimit/' + $scope.aiTests['rfTest'].trainLimit;
    console.log('Requesting');
    $scope.response = '';
    
    var httpRequest = httpRequestHandler();
    
    httpRequest.then(function (data) {
        console.log('Complete');
        console.log(data);
        $scope.displayResults(data[0], data[1], ss.sum(data[1]), 'rfTest');
    
    }, function (error) {
        console.log('Error');
        $scope.response = error;            
    });
  };

 
  $scope.testSVM = function () {
  	$scope.setURL = '/api/svm/testlimit/' + $scope.aiTests['svmTest'].testLimit + '/trainlimit/' + $scope.aiTests['svmTest'].trainLimit;
    console.log('Requesting');
    $scope.response = '';
    
    var httpRequest = httpRequestHandler();
    
    httpRequest.then(function (data) {
        console.log('Complete');
        console.log(data);
        $scope.displayResults(data[0], data[1], ss.sum(data[1]), 'svmTest');
    
    }, function (error) {
        console.log('Error');
        $scope.response = error;            
    });
  };

  $scope.runTest = function(toRun) {

  	switch(toRun) {
  		case 'svmTest':
  			$scope.testSVM();
  			break;
  		case 'rfTest':
  			$scope.testRandomForest();
  			break;
			case 'lrTest':
  			$scope.testAiMethod(testLinearRegression, 'lrTest');
  			break;
  		case 'knnTest':
  			$scope.testAiMethod(testKNNRegression, 'knnTest');
  			break;
			default:
  			break;	
  	}
  }

  $scope.displayResults = function(testSize, results, within100, aiName) {
  	$scope.aiTests[aiName].testSize = testSize;
  	$scope.aiTests[aiName].percentDistances = results;
  	$scope.aiTests[aiName].within100 = within100;

  }

}]);