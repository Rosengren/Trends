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