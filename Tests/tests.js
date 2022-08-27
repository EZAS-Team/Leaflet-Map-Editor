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

//array to loop through the test and call the test functions
const FeatureTests = [FeatureMarkerTests.Test];
//export of all the Features Tests and the FeatureTests array
export { FeatureTests, FeatureMarkerTests };
//default export of the FeatureTests array
export default FeatureTests;
