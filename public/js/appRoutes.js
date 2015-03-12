angular.module('appRoutes', [])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
	.when('/', {
		templateUrl: 'views/homeView.html',
		controller: 'MainController'
	})
	.when('/view2', {
		templateUrl: 'views/view2.html',
		controller: 'SecondController'
	});

	$locationProvider.html5Mode(true);
}]);