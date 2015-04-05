angular.module('chartController', ['ngMaterial'])
.controller('chartController', ['$scope', '$mdSidenav', '$http', '$log', function($scope, $mdSidenav, $http, $log) {

	var NUMBER_OF_STORES = 45;
	$scope.features = ["CPI", "Temperature", "Unemployment", "Fuel_Price", "MarkDown1", "MarkDown2", "MarkDown3", "MarkDown4", "MarkDown5"];

	$scope.pageTitle = ' ';


	$scope.calculateAverage = function(feature) {
	  $http.get('/api/features/')
	  	.success(function(data) {


	  	$scope.pageTitle = 'Average ' + feature;
	  	var formattedData = [];

	  	for (i = 1; i <= 45; i++)
	  		formattedData.push({key: i, value: 0.0, total: 0.0});


	  	for (d in data) {
	  		if (!isNaN(parseFloat(data[d][feature])) && isFinite(data[d][feature])) {
		  		formattedData[data[d]['Store'] - 1].value += parseFloat(data[d][feature]);
		  		formattedData[data[d]['Store'] - 1].total++;
				}
	  	}


	  	// calculate average
	  	for (i = 0; i < 45; i++) {
	  		if (formattedData[i].total != 0)
		  		formattedData[i].value /= formattedData[i].total;
	  	}

	  	$scope.barChartData = formattedData;

	  })	  	
	  .error(function(data) {
	  	console.log('Error: ' + data);
	  });
	};

	$scope.toggleRight = function() {
	    $mdSidenav('right').toggle()
	                       .then(function(){
	                       		// $log.debug("message");
		                       	// do work
	                        });
	  };


	// generate first chart
	$scope.calculateAverage($scope.features[0]);

}])
.controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function() {
    $mdSidenav('right').close()
                        .then(function(){
                          // do work
                        });
  };
});