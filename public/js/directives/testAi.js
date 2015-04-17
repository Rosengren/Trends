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

			// DATA FORMAT:
			// {"title":"Revenue","subtitle":"US$, in thousands","ranges":[150,225,300],"measures":[220,270],"markers":[250]}

			var margin = {top: 5, right: 40, bottom: 20, left: 120},
			    width = 960 - margin.left - margin.right,
			    height = 50 - margin.top - margin.bottom;

			var chart = d3.bullet()
			    .width(width)
			    .height(height);

			d3.json("bullets.json", function(error, data) {
			  var svg = d3.select("." + $scope.label).selectAll("svg")
			      .data(data)
			    .enter().append("svg")
			      .attr("class", "bullet")
			      .attr("width", width + margin.left + margin.right)
			      .attr("height", height + margin.top + margin.bottom)
			    .append("g")
			      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			      .call(chart);

			  var title = svg.append("g")
			      .style("text-anchor", "end")
			      .attr("transform", "translate(-6," + height / 2 + ")");

			  title.append("text")
			      .attr("class", "title")
			      .text(function(d) { return d.title; });

			  title.append("text")
			      .attr("class", "subtitle")
			      .attr("dy", "1em")
			      .text(function(d) { return d.subtitle; });

			});
		}
	};
});