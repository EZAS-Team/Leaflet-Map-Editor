"use strict";
import * as EZAS from "../js/Requirements.js";
let gemap;

//listens for an event that tells it to export the map given by the event
document.addEventListener("exportMap", (e) => {
    gemap = e.detail.map_object;
    exportMap();
    testGmap();
});

//gmap test
function testGmap()
{
    console.log("Testing gemap");
    console.assert(gemap != undefined, "gemap is undefined");
    console.assert(gemap != null, "gemap is null");
    console.assert(gemap instanceof EZAS.MapFeature, "gemap is not an instance of MapFeature");
    console.log("Success testing gemap");
}

//exports the map
function exportMap() {}
