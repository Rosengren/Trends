angular.module('barChart', [])
.directive('barChart', function() {

	return {
		restrict: 'EA',
		scope: {
			data: "=",
			label: "@",
			onClick: "&"
		},
		link: function($scope, $element, $attrs) {

			var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
			                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

			var margin = {top: 20, right: 20, bottom: 30, left: 40},
					width = 960 - margin.left - margin.right,
					height = 400 - margin.top - margin.bottom;

			var barPadding = 1;

			var xScale = d3.scale.ordinal()
				.domain(d3.range(dataset.length))
				.rangeRoundBands([0, width], 0.05);

			var yScale = d3.scale.linear()
				.domain([0, d3.max(dataset)])
				.range([0, height]);

			var svg = d3.select("#barChart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height",  height + margin.top + margin.bottom)
			
			svg.selectAll("rect")
				.data(dataset)
				.enter()
				.append("rect")
				.attr("x", function(d, i ) {
					return xScale(i);
				})
				.attr("y", function(d) {
					return height - yScale(d);
				})
				.attr("width", xScale.rangeBand())
				.attr("height", function(d) {
					return yScale(d);
				})
				.attr("fill", function(d) {
					return "rgb(0, 0, " + (d * 10) + ")";
				});

			svg.selectAll("text")
				.data(dataset)
				.enter()
				.append("text")
				.text(function(d) {
					return d;
				})
				.attr("text-anchor", "middle")
				.attr("x", function(d, i) {
					return xScale(i) + xScale.rangeBand() / 2;
				})
				.attr("y", function(d) {
					return height - yScale(d) + 14;
				})
				.attr("font-family", "sans-serif")
				.attr("font-size", "11px")
				.attr("fill", "white");


			$scope.renderBarChart = function(data) {

				// Update bars
				svg.selectAll("rect")
					.data(data)
					.transition()
					.duration(1000)
					.ease("linear")
					.attr("y", function(d) {
						return height - yScale(d);
					})
					.attr("height", function(d) {
						return yScale(d);
					})
					.attr("fill", function(d) {
						return "rgb(0, 0, " + (d * 10) + ")";
					});

				// Update labels
				svg.selectAll("text")
					.data(data)
					.transition()
					.duration(1000)
					.ease("linear")
					.text(function(d) { return d; })
					.attr("x", function(d, i) {
						return xScale(i) + xScale.rangeBand() / 2;
					})
					.attr("y", function(d) {
						return height - yScale(d) + 14;
					});
			}


			// watch for data changes and re-render
			$scope.$watch('data', function(newDataset, oldDataset) {
			  return $scope.renderBarChart(newDataset);
			}, true);

		},
		template: '<div id="barChart"></div>'

	};
});