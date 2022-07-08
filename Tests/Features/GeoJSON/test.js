//test file for the GeoJSON feature in geoJSON.js : Elliot : 7/6/2022
import { geoJSON } from "../../Features/GeoJSON/geoJSON.js";

//an array of all the test functions to run
//initialized here because the tests to run don't need to be reset for each test
const tests = [validateGeoJsonTest];

//used to intialize results and any needed global variables.
//only use global test variables when there is no other way
//This is called by the test runner
//Elliot : 7/6/2022
let results;
function initTests() {
    results = {
        passed: 0,
        failed: 0,
        total: 0,
    };
}

//runs each test and returns the results. This is called by the test runner
//Elliot : 7/6/2022
function runTests() {
    //run each test in the tests array
    for (let i = 0; i < tests.length; i++) {
        results = tests[i](results);
    }
    return results;
}

//tests the GeoJSON feature's validateGeoJSON function
function validateGeoJsonTest() {
    //test the validateGeoJSON function in geoJSON.js with a valid GeoJSON object
    let validGeoJson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [-122.433701, 37.767683],
                },
                properties: {
                    name: "San Francisco",
                },
            },
        ],
    };
    geoJSON.validateGeoJSON(validGeoJson) ? results.passed++ : results.failed++; //should return true
    results.total++; //increment the total number of tests run
    //test the validateGeoJSON function in geoJSON.js with an invalid GeoJSON object
    let invalidGeoJson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Points",
                    coordinates: [-122.433701, 37.767683],
                },
                properties: {
                    name: "San Franciscoss",
                },
            },
        ],
    };

    !geoJSON.validateGeoJSON(invalidGeoJson) //should return false
        ? results.passed++
        : results.failed++;
    results.total++; //increment the total number of tests run
}
