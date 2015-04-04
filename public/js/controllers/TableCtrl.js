angular.module('tableController', ['ngMaterial'])
.controller('tableController', ['$scope', '$mdSidenav', '$http', function($scope, $mdSidenav, $http) {
	$scope.pageTitle = 'Data Tables';

  // $scope.custom = {name: 'bold', description:'grey',last_modified: 'grey'};
	$scope.toggleSearch = false;
	$scope.sortable = [];
	$scope.headers = [];
	$scope.count = 10

	$scope.getTableData = function(route) {
	  $http.get(route)
	  	.success(function(data) {

	  	var headers = [];
	  	var keys = Object.keys(data[0])
	  	for (i in keys) {
	  		headers.push({name: keys[i], field: keys[i]});
	  	}

	  	$scope.headers = headers;
	  	$scope.content = data;
	  	$scope.sortable = keys

	  })
	  .error(function(data) {
	  	console.log('Error: ' + data);
	  });
	};


  // START TABS

	var tabs = [
    { title: 'Stores', 		content: ""},
    { title: 'Features', 	content: ""},
    { title: 'Tests', 		content: ""},
    { title: 'Training',	content: ""},
  ],

  selected = null,
  previous = null;

  $scope.tabs = tabs;
  $scope.selectedIndex = 0;

  $scope.$watch('selectedIndex', function(current, old){
    previous = selected;
    selected = tabs[current];

    // Note: the order of the routes is based on the index of the tab
    var routes = ['/api/stores', '/api/features/limit/100', '/api/tests/limit/100', '/api/training/limit/100'];

    $scope.getTableData(routes[current]);
  });

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