"use strict";
//imports all the tests and provides the array to run the test functions on

//Feature Tests
//Marker
import * as FeatureMarkerTests from "./Features/Marker/test.js";
//GeoJSON
//import * as FeatureGeoJSONTests from "./Features/GeoJSON/js/test.js";
//Polygon
//import * as FeaturePolygonTests from "./Features/Polygon/js/test.js";
//Polyline
//import * as FeaturePolylineTests from "./Features/Polyline/js/test.js";
//Circle
//import * as FeatureCircleTests from "./Features/Circle/js/test.js";
//Rectangle
//import * as FeatureRectangleTests from "./Features/Rectangle/js/test.js";

//helper function to create the AllTests array by joining all the sets of the test sets
function createAllTests(testSets = []) {
    let allTests = [];
    let testSetsLength = testSets.length;
    for (let i = 0; i < testSetsLength; i++) {
        let testSet = testSets[i];
        let testSetLength = testSet.length;
        for (let j = 0; j < testSetLength; j++) {
            allTests.push(testSet[j]);
        }
    }
    return allTests;
}

//array to loop through the test and call the test functions
const FeatureTests = [FeatureMarkerTests.Test];
const OtherTests = [];

const AllTests = createAllTests([FeatureTests, OtherTests]);
//export of all the Features Tests and the FeatureTests array
export { AllTests, FeatureTests, FeatureMarkerTests };
//default export of the FeatureTests array
export default AllTests;
