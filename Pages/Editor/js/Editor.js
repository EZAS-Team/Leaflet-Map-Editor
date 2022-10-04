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

//dispatches the events to each feature in the MapFeatures array
function changeStates(eventListenerName, instanceType, action, state)
{
    MapFeatures.forEach((f) => {
        if (f instanceof instanceType)
        {
            f.eventTarget.dispatchEvent(new CustomEvent(eventListenerName, {detail:{action:action, state:state}}));
        }
    });
}

//listen for a state change event and change the state
document.addEventListener("editorStateChange", (e) => {
    switch(e.detail.name)
    {
        case "Map": //update the map state
            gmap.eventTarget.dispatchEvent(new CustomEvent("mapStateChange", {detail:{ action: e.detail.action, state: e.detail.state }}));
        break;
        case "Marker": //update all the marker states
            changeStates("markerStateChange",EZAS.MarkerFeature,e.detail.action, e.detail.state);
        break;
        case "Features": //updates all the features states
            document.dispatchEvent(new CustomEvent("featuresStateChange", {detail:{ action: e.detail.action, state: e.detail.state }}));
        default:
            break;
    }
});

/**
 * Events and callbacks for interacting with the map and features
 */

//listen for a doAction event and do the action NEVER CALLED directly
document.addEventListener("doAction", (e) => { doAction(e.detail); });
function doAction(e)
{
    switch(e.action)
    {
        //Icons need to be selected before the marker is added to the map
        //this is because the marker needs to know what icon to use
        //future updates may allow for the icon to be changed after the marker is added
        //by copying the marker and recreating it with the new icon
        case "ADD_MARKER": 
            //get the selected marker icon type from the marker icon selector
            let markerType = document.getElementById("marker_type_select").value;
            //get the Icon object from the marker icon selector
            let selectedIcon = EZAS.MarkerFeature.icons[markerType];
            //add the marker to the layer that dispatched the event this should be the map in most cases
            let marker = new EZAS.MarkerFeature(e.event.latlng, {icon:selectedIcon}).addTo(e.dispatcher);
            MapFeatures.push(marker);//add the marker to the map features
            break;
        default:
            break;
    }
    gmap.updateFeatureArray(MapFeatures); //update the feature array copy contained in the map object
};

//listen for DeleteMe events and locate the feature with the guid and delete it from the map
//NEVER CALLED DIRECTLY
document.addEventListener("DeleteMe", (e)=>{deleteFeature(e.detail);});
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
    //reset to rest of the features to the default state
    MapFeatures.forEach((f) => {
        f.resetState("OnClick");
    });
    gmap.updateFeatureArray(MapFeatures); //update the feature array copy contained in the map object
}

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
    console.debug("Unloading map if it exists ...");
    if(gmap)
    {
        console.debug("Map exists, turning off ...");
        gmap = gmap.off();
        console.debug("Map exists, removing map ...");
        gmap = gmap.remove();
    }
    //set the map to the new map
    console.debug("Setting map to passed map ...");
    gmap = map;
    //Set the editor map features array to the new map features array
    console.debug("Updating editor's map features array to passed map object feature array...");
    MapFeatures = map.mapFeatures;
};

//listen for an exportTheMap event from a button click and dispatch an event to the exporter with the map
document.addEventListener("exportTheMap", (e) => {
    exportMap();
});
function exportMap() {
    //update the map features array in the map object
    gmap.updateFeatureArray(MapFeatures);
    //custom event telling the exporter to export the map
    let event = new CustomEvent("exportMap", {
        detail:{
            map_object: gmap 
        }
    });
    //dispatch the event to the exporter
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
document.addEventListener("updateFeatureProperties", (e) => {updateFeatureProperties(e.detail);},true);
function updateFeatureProperties(e)
{
    let feature = MapFeatures.find((f) => { return f.guid == e.guid; });
    if (feature === null)
    {
        throw new Error("Feature with guid: " + e.guid + " not found");
    }
    //if the event has a fn property then call the function with the value
    if (e.fn !== undefined)
    {
        feature.updateProperty(e.propertyName, e.propertyValue, e.fn);
    }
    feature.updateProperty(e.propertyName, e.propertyValue, e.fn);
};