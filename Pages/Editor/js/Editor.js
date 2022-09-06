"use strict";
import * as EZAS from "../js/Requirements.js";

//holds all the map features that are on the map
let MapFeatures = [];

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

//Add the gmap to the MapFeatures array
MapFeatures.push(gmap);

//listen for a state change event and change the state
document.addEventListener("editorStateChange", (e) => {
    switch(e.detail.name)
    {
        case "Map":
            gmap.eventTarget.dispatchEvent(new CustomEvent("mapStateChange", {detail:{ action: e.detail.action, state: e.detail.state }}));
        break;
        default:
            break;
    }
});

/**
 * Events and callbacks for interacting with the map and features
 */

document.addEventListener("doAction", (e) => { doAction(e); });
function doAction(e)
{
    switch(e.detail.action)
    {
        case "ADD_MARKER":
            //add the marker to the layer that dispatched the event
            let marker = new EZAS.MarkerFeature(e.detail.event.latlng).addTo(e.detail.dispatcher);
            MapFeatures.push(marker);//add the marker to the map features
            break;
        default:
            break;
    }
};

//listen for DeleteMe events and locate the feature with the guid and delete it
document.addEventListener("DeleteMe", (e)=>{deleteFeature(e);});
//finds the feature with the given guid and removes it from the map and the MapFeatures array
function deleteFeature(e)
{
    //find the feature with the guid
    let feature = MapFeatures.find((f) => { return f.guid == e.guid; });
    if (feature != null) 
    {
        //remove the feature from the map it is on
        feature.remove();
        //remove the feature from the MapFeatures array
        MapFeatures.splice(MapFeatures.indexOf(feature), 1);
    }
}

/**
 * Events for the importer and exporter
 */

//listens for a finished import event containing the map and updates the map to it
document.addEventListener("updateMap", (e) => {
    updateMap(e.detail.map_object);
});

//listen for an exportTheMap event from a button click and dispatch an event to the exporter with the map
document.addEventListener("exportTheMap", (e) => {
    exportMap();
});

//update the map
function updateMap(map) {
    gmap = map;
}

function exportMap() {
    //custom event telling the exporter to export the map
    let event = new CustomEvent("exportMap", {
        detail:{
            map_object: gmap 
        }
    });
    document.dispatchEvent(event);
}

