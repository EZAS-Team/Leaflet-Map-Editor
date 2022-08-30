"use strict";
import * as EZAS from "../js/Requirements.js";

//listen for if we need to import a map
window.addEventListener("importTheMap", (e) => {
    importMap();
});

//the map that is built by the importer based on JSON and dispatched to the editor when the import is done
let gmap = new EZAS.MapFeature("map", {});

//import the map and then tell the editor that it needs to update the map
function importMap() {
    //dispach event to the window that an import has occured and the map should be imported
    let event = new CustomEvent("updateMap", { map_object: gmap });
    window.dispatchEvent(event);
}
