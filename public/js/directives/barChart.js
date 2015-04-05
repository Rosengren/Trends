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

			var NUMBER_OF_STORES = 45;

			var dataset = [];
			for (i = 1; i <= NUMBER_OF_STORES; i++) {
				dataset.push({key: i, value: 0});
			}

			var margin = {top: 10, right: 20, bottom: 30, left: 60},
					width = 960 - margin.left - margin.right,
					height = 400 - margin.top - margin.bottom;

			var barPadding = 1;

			var xScale = d3.scale.ordinal()
				.domain(d3.range(0, dataset.length))
				.rangeRoundBands([0, width], 0.05);

			var yScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) { return d.value; })])
				.range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(xScale)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(yScale)
			    .orient("left")
			    .ticks(10);

			var key = function(d) {
				return d.key;
			};

			var svg = d3.select("#barChart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height",  height + margin.top + margin.bottom)
			
			svg.selectAll("rect")
				.data(dataset, key)
				.enter()
				.append("rect")
				.attr("x", function(d, i ) {
					return xScale(i);
				})
				.attr("y", function(d) {
					return yScale(d.value);
				})
				.attr("width", xScale.rangeBand())
				.attr("height", function(d) {
					return (yScale(0) - yScale(d.value));
				})
				.attr("transform", "translate(" + margin.left + ",0)")
				.attr("fill", "#3498db");

			svg.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(" + margin.left + "," + height + ")")
			    .call(xAxis);

			svg.append("g")
			    .attr("class", "y axis")
			    .attr("transform", "translate(" + margin.left + ",0)")
			    .call(yAxis);

			$scope.renderBarChart = function(data) {

				data = data || [];
				xScale.domain(d3.range(0, data.length)); // TODO: Change this to display values instead of number range
				yScale.domain([0, d3.max(data, function(d) { return d.value; })])

				//Select…
				var bars = svg.selectAll("rect")
					.data(data);


				// Update bars
				svg.selectAll("rect")
					.data(data)
					.transition()
					.duration(1000)
					.ease("linear")
					.attr("x", function(d, i) {
						return xScale(i);
					})
					.attr("y", function(d) {
						return yScale(d.value);
					})
					.attr("width", xScale.rangeBand())
					.attr("height", function(d) {
						return (yScale(0) - yScale(d.value));
					})
					.attr("transform", "translate(" + margin.left + ",0)");

				//Update X axis
				svg.select(".x.axis")
		    	.transition()
		    	.duration(1000)
					.call(xAxis);
				
				//Update Y axis
				svg.select(".y.axis")
		    	.transition()
		    	.duration(1000)
					.call(yAxis);
			}


			// watch for data changes and re-render
			$scope.$watch('data', function(newDataset, oldDataset) {
			  return $scope.renderBarChart(newDataset);
			}, true);

		},
		template: '<div id="barChart"></div>'

	};
});