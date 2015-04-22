angular.module('resultsChart', [])
.directive('resultsChart', function() {

	return {
		restrict: '',
		scope: {
			data: "=",
			chartid: "@",
			label: "@",
			onClick: "&"
		},
		link: function($scope, $element, $attrs) {


			var formatxAxis = d3.format('.0f');

			d3.select("#charts").append("h3")
				.text($attrs.chartid);

			var margin = {top: 5, right: 20, bottom: 30, left: 50},
					width = 1210 - margin.left - margin.right,
					height = 400 - margin.top - margin.bottom;
			
			var x = d3.time.scale()
				.range([0, width]);

			var y = d3.scale.linear()
				.range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.tickFormat(formatxAxis);

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");

			var line = d3.svg.line()
				.x(function(d, i) { return x(i); })
				.y(function(d) { return y(d); });

			var svg = d3.select("#charts").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Relative Distance (%)");

			svg.append("path")
				.attr("class", "line");
		
			$scope.renderResultsChart = function(newData) {

				if (newData !== undefined && newData !== []) {

					x.domain([0, newData.length * 10]);
					y.domain([0, d3.max(newData)]);

					line = d3.svg.line()
									.x(function(d, i) { return x(i * 10); })
									.y(function(d) { return y(d); });

					svg.select(".line")
						.datum(newData)
						.transition()
						.duration(1000)
						.ease("linear")
						.attr("class", "line")
						.attr("d", line);

					svg.select(".x.axis")
						.transition()
						.duration(1000)
						.call(xAxis);

					svg.select(".y.axis")
						.transition()
						.duration(1000)
						.call(yAxis);


				}
			}

			// watch for data changes and re-render
			$scope.$watch('data', function(newDataset, oldDataset) {
			  return $scope.renderResultsChart(newDataset);
			}, true);

		},
		template: ''

	};
});