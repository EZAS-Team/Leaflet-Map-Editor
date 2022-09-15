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

//listen for a doAction event and do the action NEVER CALLED directly
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

//listen for DeleteMe events and locate the feature with the guid and delete it from the map
//NEVER CALLED DIRECTLY
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
};

/**
 * Events for the importer and exporter
 */

//listens for a finished import event containing the map and updates the map to it
document.addEventListener("updateMap", (e) => {
    updateMap(e.detail.map_object);
});
//update the map
function updateMap(map) {
    //unload the map
    gmap.remove();
    //empty the map features array
    MapFeatures = [];
    //set the map to the new map
    gmap = map;
    //add the new map to the map features array
    MapFeatures.push(gmap);
};

//listen for an exportTheMap event from a button click and dispatch an event to the exporter with the map
document.addEventListener("exportTheMap", (e) => {
    exportMap();
});
function exportMap() {
    //custom event telling the exporter to export the map
    let event = new CustomEvent("exportMap", {
        detail:{
            map_object: gmap 
        }
    });
    document.dispatchEvent(event);
};

/**
 * 
 * Events and callbacks for the property editor
 */

//listens for a request to open a properties editor and sets
//the properties editor to the feature that dispatched the event's html
document.addEventListener("openPropertyEditor", (e) => {openPropertyEditor(e.detail);},true);
function openPropertyEditor(feature)
{
    //get the properties editor element
    let propertiesEditor = document.getElementById("property_editor");
    //get the properties editor content element
    let propertiesEditorContent = document.getElementById("property_editor_content");
    //set the properties editor content to the features html
    propertiesEditorContent.innerHTML = feature.propertyEditor.toHTML();
    //set the properties editor panel to visible
    propertiesEditor.style.visibility = "visible";
};

//close the properties editor
document.addEventListener("closePropertyEditor", (e) => {closePropertyEditor();},true);
function closePropertyEditor()
{
    //get the properties editor panel element
    let propertiesEditor = document.getElementById("property_editor");
    //get the properties editor content element
    let propertiesEditorContent = document.getElementById("property_editor_content");
    //set the properties editor content to the nothing
    propertiesEditorContent.innerHTML = "";
    //set the properties editor panel to hidden
    propertiesEditor.style.visibility = "hidden";
};

//updates a given property of a given guid with a given value
document.addEventListener("updateFeatureProperties", (e) => {updateFeatureProperties(e);},true);
function updateFeatureProperties(e)
{
    let obj = e.detail;
    let guid = obj.guid;
    let feature = MapFeatures.find((f) => { return f.guid == guid; });
    if (feature === null)
    {
        throw new Error("Feature with guid: " + guid + " not found");
    }
    feature.updateProperty(obj.propertyName, obj.propertyValue);
};