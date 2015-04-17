angular.module('comparisonController', ['ngMaterial'])
.controller('comparisonController', ['$scope', '$http', '$log', function($scope, $http, $log) {

	$scope.pageTitle = "Comparison";

	$scope.aiTests = {"lrTest": "Linear Regression", "svmTest": "Support Vector Machine", "rfTest": "Random Forest", "knnTest": "K-Nearest Neighbor"};

}]);