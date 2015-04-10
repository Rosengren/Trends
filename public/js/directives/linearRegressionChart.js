angular.module('linearRegressionChart', [])
.directive('linearRegressionChart', function() {

	return {
		restrict: 'EA',
		scope: {
			data: "=",
			label: "@",
			onClick: "&"
		},
		link: function($scope, $element, $attrs) {

			var margin = {top: 5, right: 20, bottom: 30, left: 50},
					width = 1210 - margin.left - margin.right,
					height = 400 - margin.top - margin.bottom;

			var x = d3.time.scale()
				.range([0, width]);

			var y = d3.scale.linear()
				.range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");

			var line = d3.svg.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.close); });

			var svg = d3.select("#linearRegressionChart").append("svg")
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
				.text("Sales ($)");

			svg.append("path")
				.attr("class", "reg");

			svg.append("path")
				.attr("class", "line");
		
			$scope.renderLinearRegression = function(newData) {

				if (newData !== undefined) {

					x.domain(d3.extent(newData, function(d) { return d.date; }));
					y.domain(d3.extent(newData, function(d) { return d.Weekly_Sales; }));


					line = d3.svg.line()
									.x(function(d) { return x(d.date); })
									.y(function(d) { return y(d.Weekly_Sales); });


					// Derive a linear regression
					var lin = ss.linear_regression().data(newData.map(function(d) {

					return [+d.date, d.Weekly_Sales];
				})).line();

					// Create a line based on the beginning and endpoints of the range
					var lindata = x.domain().map(function(t) {
						return {
							date: new Date(t),
							Weekly_Sales: lin(+t)
						};
					});

					svg.select(".line")
						.datum(newData)
						.transition()
						.duration(1000)
						.ease("linear")
						.attr("class", "line")
						.attr("d", line);

					svg.select(".reg")
						.datum(lindata)
						.transition()
						.duration(1000)
						.ease("linear")
						.attr("class", "reg")
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
			  return $scope.renderLinearRegression(newDataset);
			}, true);

		},
		template: '<div id="linearRegressionChart"></div>'

	};
});