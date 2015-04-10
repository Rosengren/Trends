angular.module('linearRegressionController', ['ngMaterial'])
.controller('linearRegressionController', ['$scope', '$mdSidenav', '$http', function($scope, $mdSidenav, $http) {
	$scope.pageTitle = 'Linear Regression';

	$scope.testStuff = function() {
		$http.get('/api/linearRegression/limit/1000/store/3/dept/1')
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

	$scope.testStuff();
	
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