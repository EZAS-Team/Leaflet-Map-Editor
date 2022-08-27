"use strict";
//Marker test.js : Elliot 8/28/2022
import FeatureMarker from "../../../Features/Marker/js/FeatureMarker.js";
//Test that a marker can be created with the default constructor to be at 0,0 with no options and a unique id: Elliot Imhoff 8/24/2022
function FeatureMarkerCreationTest(results) {
    let Markers = [];
    let ids = [];
    for (let i = 0; i < 10; i++) {
        Markers.push(new FeatureMarker());
    }
    let numOfMarkers = Markers.length;
    while (numOfMarkers > 0) {
        let temp = Markers.pop();
        if (temp === undefined) {
            break;
        }
        let tempexport = temp.getExportDetails();
        //tests
        results.total += 5; //test that the id is unique
        ids.find(() => {
            return this.id === tempexport.id;
        }) === undefined
            ? results.passed++
            : results.failed++;
        //test that the latlng is [0,0]
        tempexport.parameters.latlng.lat === 0 &&
        tempexport.parameters.latlng.lng === 0
            ? results.passed++
            : results.failed++;
        //test that the options are empty
        let testOptions = {};
        tempexport.parameters.options == testOptions
            ? results.passed++
            : results.failed++;
        //test that the type is a Marker
        tempexport.type === "Marker" ? results.passed++ : results.failed++;
        //test that we can recreate the object with the parameters
        let tempMarker = new L.Marker(
            tempexport.parameters.latlng,
            tempexport.parameters.options
        );
        tempexport.object === tempMarker ? results.passed++ : results.failed++;
        //push the id into ids
        ids.push(tempexport.id);
    }
    return results;
}

//an array of all the test functions to run
//initialized here because the tests to run don't need to be reset for each test
const tests = [FeatureMarkerCreationTest];
//used to intialize results and any needed global variables.
//only use global test variables when there is no other way
//this is called by the test runner
function initTests() {
    let results = {
        passed: 0,
        failed: 0,
        total: 0,
    };
    return results;
}

//runs each test and returns the results. This is called by the test runner
function runTests(results) {
    //run each test in the tests array
    for (let i = 0; i < tests.length; i++) {
        results = tests[i](results);
    }
    return results;
}

const Test_Feature_Marker = () => {
    return runTests(initTests());
};

const Test = () => {
    return Test_Feature_Marker();
};

export { Test };
