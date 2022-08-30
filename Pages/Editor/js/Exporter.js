"use strict";
import * as EZAS from "../js/Requirements.js";
let gmap;

//listens for an event that tells it to export the map given by the event
window.addEventListener("exportMap", (e) => {
    gmap = e.map_object;
    exportMap();
});

//exports the map
function exportMap() {}
