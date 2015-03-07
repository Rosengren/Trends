angular.module('controller1', [])
.controller('MainController', function($scope, $http) {
	$scope.pageTitle = 'Main Page';

	$http.get('/api/stores')
		.success(function(data) {
			
			$scope.stores = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

		// $scope.createTodo = function() {
		// 		$http.post('/api/todos', $scope.formData)
		// 			.success(function(data) {
		// 				$scope.formData = {}; // clear the form so our user is ready to enter another
		// 				$scope.todos = data;
		// 				console.log(data);
		// 			})
		// 			.error(function(data) {
		// 				console.log('Error: ' + data);
		// 			});
		// 	};
});