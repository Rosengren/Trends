angular.module('linearRegressionController', ['ngMaterial'])
.controller('linearRegressionController', ['$scope', '$http', function($scope, $http) {
	$scope.pageTitle = 'Linear Regression';

  // $scope.custom = {name: 'bold', description:'grey',last_modified: 'grey'};
	

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