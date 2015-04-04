angular.module('chartController', ['ngMaterial'])
.controller('chartController', ['$scope', '$mdSidenav', '$http', '$log', function($scope, $mdSidenav, $http, $log) {

	$scope.pageTitle = 'Chart';


	$scope.getTableData = function(route) {
	  $http.get(route)
	  	.success(function(data) {
	  	$scope.tableData = data;
	  })	  	
	  .error(function(data) {
	  	console.log('Error: ' + data);
	  });
	};

	$scope.barChartData = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];


	$scope.showDiff = function() {
		console.log("SHOW DIFF DID CLICKED");
		$scope.barChartData = [ 11, 12, 15, 20, 18, 17, 16, 18, 23, 25,
												5, 10, 13, 19, 21, 25, 22, 18, 15, 13 ];

	};

	$scope.toggleRight = function() {
	    $mdSidenav('right').toggle()
	                       .then(function(){
	                       		// $log.debug("message");
		                       	// do work
	                        });
	  };
}])
.controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function() {
    $mdSidenav('right').close()
                        .then(function(){
                          // do work
                        });
  };
});