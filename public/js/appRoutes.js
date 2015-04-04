angular.module('appRoutes', [])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
	.when('/', {
		templateUrl: 'views/homeView.html',
		controller: 'mainController'
	})
	.when('/chartView', {
		templateUrl: 'views/chartView.html',
		controller: 'chartController'
	})
	.when('/tableView', {
		templateUrl: 'views/tableView.html',
		controller: 'tableController'
	});

	$locationProvider.html5Mode(true);
}]);