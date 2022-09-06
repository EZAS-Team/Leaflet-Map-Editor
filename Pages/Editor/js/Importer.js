"use strict";
import * as EZAS from "./Requirements.js";

//listen for if we need to import a map
document.addEventListener("importTheMap", (e) => {
    importMap();
});


//import the map and then tell the editor that it needs to update the map
function importMap() {
    //dispach event to the window that an import has occured and the map should be imported
    
    //the map that is built by the importer based on JSON and dispatched to the editor when the import is done
    let gimap = new EZAS.MapFeature("imap", {});
    let event = new CustomEvent("updateMap", {detail:{map_object: gimap }});
    document.dispatchEvent(event);
}
