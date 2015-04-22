var fs = require('fs'),
    Promise = require('promise'),
    RandomForestClassifier = require('random-forest-classifier').RandomForestClassifier;

module.exports = {

  testAi: function(testData, trainingData, response) {

    var MILLIS_IN_A_DAY = 86400000.0;

    var duplicateTest = [];
    var duplicateTraining = [];
    
    console.log("random forest: formatting training data...");
    for (var i = 0; i < trainingData.length; i++) {
      trainingData[i].Date.setFullYear(1970);
      var d = trainingData[i].Date.getTime() / MILLIS_IN_A_DAY;
      duplicateTraining.push({Store: trainingData[i].Store, 'Date': d, Dept: trainingData[i].Dept, Weekly_Sales: trainingData[i].Weekly_Sales});
    }
    console.log("random forest: formatting test data...");
    for (var i = 0; i < testData.length; i++) {
      testData[i].Date.setFullYear(1970);
      var d = testData[i].Date.getTime() / MILLIS_IN_A_DAY;
      duplicateTest.push({Store: testData[i].Store, 'Date': d, Dept: testData[i].Dept, Weekly_Sales: testData[i].Weekly_Sales});

    };

    console.log("random forest: initializing classifier...");
    var rf = new RandomForestClassifier({
        n_estimators: 5
    });

    console.log("random forest: training classifier...");
    var result = new Promise(function(resolve, reject) {
      rf.fit(duplicateTraining, null, "Weekly_Sales", function(err, trees) {

        console.log("random forest: testing classifier...");

        var totalDistances = 0;
        var percentDistances = [0,0,0,0,0,0,0,0,0,0];
        var distances = [];

        //console.log(JSON.stringify(trees, null, 4));
        // var predictions = rf.predict(duplicateTest, trees);

        duplicateTest.forEach(function(ex) {
          console.log(ex);
          var prediction = rf.predict([ex], trees);

          console.log("Expected: " + ex.Weekly_Sales + " Prediction: " + prediction[0]);

          var distance = (Math.abs((prediction[0] - ex.Weekly_Sales) / ex.Weekly_Sales)) * 100;

          totalDistances++;
          if (distance < 100) {
            if (distance < 10) {
              percentDistances[0]++;
            } else {
              percentDistances[(''+distance)[0]]++;
            }
          }

          distances.push(distance);
        });

        console.log("random forest: percent Distances: " + percentDistances);
        resolve([totalDistances, percentDistances]);

      });
    });

    result.then(function(data) {
      console.log("random forest: sending response: " + data);
      response.json(data);
    })
  }
};