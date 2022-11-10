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
    console.debug(`State change event received: ${e.detail.state}, ${e.detail.action}`);
    MapFeatures.forEach((f) => {
        f.resetState("OnClick");
    });
    switch(e.detail.name)
    {
        case "Map": //update the map state
            gmap.eventTarget.dispatchEvent(new CustomEvent("mapStateChange", {detail:{ action: e.detail.action, state: e.detail.state }}));
        break;
        case "Marker": //update all the marker states
            changeStates("markerStateChange",EZAS.MarkerFeature,e.detail.action, e.detail.state);
        break;
        case "Circle": //update all the circle states
            changeStates("circleStateChange",EZAS.CircleFeature,e.detail.action, e.detail.state);
        break;
        case "Rectangle": //update all the rectangle states
            changeStates("rectangleStateChange",EZAS.RectangleFeature,e.detail.action, e.detail.state);
        break;
        case "Features": //updates all the features states
            changeStates("markerStateChange",EZAS.MarkerFeature,e.detail.action, e.detail.state);
            changeStates("circleStateChange",EZAS.CircleFeature,e.detail.action, e.detail.state);
            changeStates("rectangleStateChange",EZAS.RectangleFeature,e.detail.action, e.detail.state);
        break;
        default:
            console.error(`Unknown Editor State Change Event with Name ${e.detail.name}, Action ${e.detail.action}, State ${e.detail.state}`);
            break;
    }
});

/**
 * Events and callbacks for interacting with the map and features
 */

//listen for a doAction event and do the action NEVER CALLED directly
//used for map click events
document.addEventListener("doAction", (e) => { doAction(e.detail); });
function doAction(e)
{
    let options = e.options
    MapFeatures.forEach((f) => {
        f.resetState("OnClick");
    });
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
            if (e.options.icon)
            {
                selectedIcon = e.options.icon;
            }
            //add the marker to the layer that dispatched the event this should be the map in most cases
            e.options.icon = selectedIcon;
            options.iconType = markerType;
            let marker = new EZAS.MarkerFeature(e.event.latlng, e.options).addTo(e.dispatcher);
            MapFeatures.push(marker);//add the marker to the map features
            console.debug("Added marker to map");
            break;
        case "ADD_CIRCLE":
            //get the circle radius from the circle radius number input
            let radius = document.getElementById("circle_radius_input").value;
            if(e.options.radius)
            {
                radius = e.options.radius;
            }
            e.options.radius = radius;
            let circle = new EZAS.CircleFeature(e.event.latlng, e.options).addTo(e.dispatcher);
            MapFeatures.push(circle);//add the circle to the map features
            console.debug("Added circle to map");
            break;
        case "ADD_RECTANGLE":
            let rectangleHeightAndWidth = .01;
            let bounds1;
            let bounds2;
            if(e.options.bounds)
            {
                bounds1 = e.options.bounds[0];
                bounds2 = e.options.bounds[1];
            }
            else{
                bounds1 = e.event.latlng;
                bounds2 = new L.latLng((bounds1.lat + rectangleHeightAndWidth), (bounds1.lng + rectangleHeightAndWidth));
            }
            let rectangle = new EZAS.RectangleFeature([bounds1,bounds2], e.options).addTo(e.dispatcher);
            MapFeatures.push(rectangle);//add the rectangle to the map features
            console.debug("Added rectangle to map");
            break;
        default:
            console.error(`Action ${e.action} not implemented`);
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
    MapFeatures.forEach((f) => {
        f.resetState("OnClick");
    });
    let feature = MapFeatures.find((f) => { return f.guid == e.guid; });
    if (feature != null) 
    {
        //remove the feature from the map it is on
        gmap.removeLayer(feature);
        //remove the feature from the MapFeatures array
        MapFeatures.splice(MapFeatures.indexOf(feature), 1);
    }

    //reset to rest of the features to the default state
    gmap.updateFeatureArray(MapFeatures); //update the feature array copy contained in the map object
}

/**
 * Events for the importer and exporter
 */

//listens for a finished import event containing the map and updates the map to it
document.addEventListener("clearMap", (e) => {
    clearMap();
});
//clear the map
function clearMap() {
    //unload the map
    gmap.updateFeatureArray(MapFeatures);
    if(gmap)
    {
        console.debug("Clearing map");
        gmap.clear();
    }
    //MapFeatures = gmap.featureArray; //update the MapFeatures array
    console.debug("Map cleared");
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
    let feature = MapFeatures.find((f) => { return f.guid === e.guid; });
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


//event listener that when called dispatches an event to the document with the map object
document.addEventListener("getMap", (e) => {getMap();},true);
function getMap()
{
    //custom event telling the exporter to export the map
    let event = new CustomEvent("returnMap", {
        detail:{
            map_object: gmap 
        }
    });
    //dispatch the event to the exporter
    document.dispatchEvent(event);
}