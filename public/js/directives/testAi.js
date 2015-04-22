angular.module('testAi', [])
.directive('testAi', function() {

	return {
		restrict: 'EA',
		scope: {
			data: "=",
			label: "@",
			className: "=",
			onClick: "&"
		},
		link: function($scope, $element, $attrs) {

		}
	};
});