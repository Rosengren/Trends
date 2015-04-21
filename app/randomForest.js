var fs = require('fs'),
    RandomForestClassifier = require('random-forest-classifier').RandomForestClassifier;

module.exports = {

  testAi: function(testData, trainingData) {

    var MILLIS_IN_A_DAY = 86400000.0;

    var duplicateTest = [];
    var duplicateTraining = [];
    
    console.log("1");
    for (var i = 0; i < trainingData.length; i++) {
      trainingData[i].Date.setFullYear(1970);
      var d = trainingData[i].Date.getTime() / MILLIS_IN_A_DAY;
      duplicateTraining.push({Store: trainingData[i].Store, 'Date': d, Dept: trainingData[i].Dept, Weekly_Sales: trainingData[i].Weekly_Sales});
    }
    console.log("2");
    for (var i = 0; i < testData.length; i++) {
      testData[i].Date.setFullYear(1970);
      var d = testData[i].Date.getTime() / MILLIS_IN_A_DAY;
      duplicateTest.push({Store: testData[i].Store, 'Date': d, Dept: testData[i].Dept, Weekly_Sales: testData[i].Weekly_Sales});

    };

    console.log("3");
    var rf = new RandomForestClassifier({
        n_estimators: 10
    });


    for (var i = 0; i < duplicateTraining.length; i++) {
      if (isNaN(duplicateTraining[i].Date) || isNaN(duplicateTraining[i].Dept) || isNaN(duplicateTraining[i].Weekly_Sales) || isNaN(duplicateTraining[i].Store)) {
        console.log(duplicateTraining);
      }
    }

    for (var i = 0; i < duplicateTest.length; i++) {
      if (isNaN(duplicateTest[i].Date) || isNaN(duplicateTest[i].Dept) || isNaN(duplicateTest[i].Weekly_Sales) || isNaN(duplicateTest[i].Store)) {
        console.log(duplicateTest);
      }
    }

    console.log("4")
    // console.log(duplicateTest);
    // console.log(duplicateTraining);
    rf.fit(duplicateTraining, null, "Weekly_Sales", function(err, trees) {
      console.log("GOT HERE");
      //console.log(JSON.stringify(trees, null, 4));
      var pred = rf.predict(duplicateTest, trees);
      console.log(pred);

    });

    // return "RESULT";
  }
};