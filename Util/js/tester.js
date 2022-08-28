"use strict";
import { Features, Debug } from "../../../Util/js/requirements.js";
import * as Tests from "../../../Tests/tests.js";
class Tester {
    //Tests is an array of the arrays of test functions from the tests.js file
    //Example of a passed Tests array is the FeatureTests Array from tests.js
    //Defaults to AllTests so that if created without a passed Tests array, it will run all tests
    constructor(tests = Tests.AllTests) {
        //holds results of tests
        this.resetResults();
        //holds the set of arrays with test functions to run
        this.tests = tests;
    }

    //runs the tests in the array of test functions
    //Example of a passed Tests array: [FeatureTests]
    // where FeatureTests is an array of test functions: [FeatureMarkerTests.Test]
    // Defaults to what the constructor takes has set
    run(tests = this.tests) {
        let testsLength = tests.length;
        for (let i = 0; i < testsLength; i++) {
            //runs the next test function and save results
            let result = tests[i]();
            //pushes the result to the results array
            this.results.push(result);
        }
    }

    //prints the results of the tests using the debugger functions
    printResults() {
        let resultsLength = this.results.length;
        for (let i = 0; i < resultsLength; i++) {
            Debug.debugInfo(this.results[i]);
        }
    }

    //resets the tests array
    resetTests() {
        this.tests = [];
    }

    //resets the results array
    resetResults() {
        this.results = [];
    }
}

export { Tester };
export default Tester;
