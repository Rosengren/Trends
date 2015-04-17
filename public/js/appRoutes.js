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
	})
	.when('/linearRegressionView', {
		templateUrl: 'views/linearRegressionView.html',
		controller: 'linearRegressionController'
	})
	.when('/testAiView', {
		templateUrl: 'views/testAiView.html',
		controller: 'comparisonController'
	});

	$locationProvider.html5Mode(true);
}]);