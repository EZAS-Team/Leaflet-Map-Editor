"use strict";
import * as EZAS from "../js/Requirements.js";

//The map that is used in the editor
let gmap = new EZAS.MapFeature("map", {
    center: [51.505, -0.09],
    zoom: 13,
    editable: true,
}).setView([51.505, -0.09], 13);
//Add the tile layers to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
}).addTo(gmap);

//States for the map editor

//listen for a state change event and change the state
window.addEventListener("editorStateChange", (e) => {
    switch (e.name) {
        case "Map":
            gmap.MapStateHandle.setState(e.action, e.state);
            break;
        default:
            break;
    }
});

let marker;
try {
    marker = new EZAS.MarkerFeature([51.5, -0.09], {});
    marker.addTo(gmap);
    marker.on("click", function (e) {
        this.propertyEditor.open();
    });
    marker.on("update", function (e) {
        this.propertyEditor.update();
    });
    marker.on("saveChanges", function (e) {
        this.propertyEditor.saveChanges();
    });
} catch (error) {
    console.log(error);
}

/**
 * Events for the importer and exporter
 */

//listens for a finished import event containing the map and updates the map to it
window.addEventListener("updateMap", (e) => {
    updateMap(e.map_object);
});

//listen for an exportTheMap event from a button click and dispatch an event to the exporter with the map
window.addEventListener("exportTheMap", (e) => {
    exportMap();
});

//update the map
function updateMap(map) {
    gmap = map;
}

function exportMap() {
    //custom event telling the exporter to export the map
    let event = new CustomEvent("exportMap", { map_object: gmap });
    window.dispatchEvent(event);
}
