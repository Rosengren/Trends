angular.module('linearRegressionController', ['ngMaterial'])
.controller('linearRegressionController', ['$scope', '$mdSidenav', '$http', function($scope, $mdSidenav, $http) {
	$scope.pageTitle = 'Linear Regression';

	$scope.plotParam = {
		store: 10,
		department: 10,
		limit: 1000
	};

	$scope.getLinearRegressionData = function(store, department, limit) {
		$http.get('/api/regression/limit/' + limit 
			+ '/store/' + store + '/dept/' + department)
		.success(function(data) {
			for (var i in data) {
				data[i].date = new Date(data[i].Date);
			}

			$scope.linearChartData = data;
		})
		.error(function(data) {
			console.log("Error: " + data);
		});
	};

	$scope.getLinearRegressionTestData = function(store, department, limit) {
		$http.get('/api/tests/limit/' + limit 
			+ '/store/' + store + '/dept/' + department)
		.success(function(data) {
			for (var i in data) {
				data[i].date = new Date(data[i].Date);
			}

			$scope.linearChartData = data;
		})
		.error(function(data) {
			console.log("Error: " + data);
		});
	};


	$scope.plotLinearRegression = function() {
		$scope.getLinearRegressionData(
			$scope.plotParam.store,
			$scope.plotParam.department,
			$scope.plotParam.limit);
	}
	

	$scope.plotLinearRegressionTestData = function() {
		$scope.getLinearRegressionTestData(
			$scope.plotParam.store,
			$scope.plotParam.department,
			$scope.plotParam.limit);
	}
	
	$scope.plotLinearRegression();

}])
.filter('startFrom',function (){
  return function (input,start) {
  	if (start !== undefined && input !== undefined) {
	    start = +start;
	    return input.slice(start);
	  } else {
	  	return [];
	  }
  }
});