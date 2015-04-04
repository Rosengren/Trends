angular.module('chartController', ['ngMaterial'])
.controller('chartController', ['$scope', '$mdSidenav', '$log', function($scope, $mdSidenav, $log) {

	$scope.pageTitle = 'Chart';

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