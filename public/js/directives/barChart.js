angular.module('barChart', [])
.directive('barChart', function() {

	return {
		link: function($scope, $element, $attrs) {

			var data = {letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
									frequency: [0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02288, 0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025, 0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150, 0.01974, 0.00074]};

			var margin = {top: 20, right: 20, bottom: 30, left: 40},
					width = 960 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;

			var x = d3.scale.ordinal()
				.rangeRoundBands([0, width], 0.1);

			var y = d3.scale.linear()
				.range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(10, "%");

			var svg = d3.select("#barChart").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// x.domain(data['letter']);
			// y.domain([0, d3.max(data['frequency'])]);
			d3.csv("data.csv", type, function(error, data) {
				x.domain(data.map(function(d) { return d.letter; }));
				y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90")
					.attr("y", 6)
					.attr("dy", "0.71em")
					.style("text-anchor", "end")
					.text("Frequency");

				svg.selectAll(".bar")
					.data(data)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function(d) { return x(d.letter); })
					.attr("width", x.rangeBand())
					.attr("y", function(d) { return y(d.frequency); })
					.attr("height", function(d) { return height - y(d.frequency); });
			});

			function type(d) {
				d.frequency = +d.frequency;
				return d;
			}

		},
		template: '<div id="barChart"></div>'

	};
});