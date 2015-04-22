var _ = require("underscore"),
    utils = require("../utilities");

var DecisionTreeClassifier = function(params) {
    this.criterion = params.criterion || 'entropy';
    this.splitter = params.splitter || 'best';
    this.min_samples_split = params.min_samples_split || 2;
    this.min_samples_leaf = params.min_samples_leaf || 1;
    //this.max_depth = params.max_depth || 5;
    this.num_tries = params.num_tries || 10;
};

DecisionTreeClassifier.prototype = {
    fit: function(data, features, y) {
      var major_label = utils.GetDominate(_.pluck(data, y));
      return utils.C45(data, features, y, major_label, this.num_tries);
    },
    predict: function(sample) {
        var root = this.model;

        if (typeof root === 'undefined') {
            return 'null';
        }

        while (root.type !== "result") {
            var attr = root.name;
            if (root.type === 'feature_real') {
                var sample_value = parseFloat(sample[attr]);
                if (sample_value <= root.cut){
                    child_node = root.vals[1];
                } else {
                    child_node = root.vals[0];
                }
            } else {
                var sample_value = sample[attr];
                var child_node = _.detect(root.vals, function(x) {
                    return x.name == sample_value;
                });
            }
            root = child_node.child;
        }

        return root.val;
    }
};

module.exports = DecisionTreeClassifier;