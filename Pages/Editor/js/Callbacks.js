"use strict";
//This file contains the callback functions for the Editor page and cant be a module
//dispatches an event to the Editor telling it to dispatch an event with the map object
function exportMap() {
    //dispach event to export map with the map object
    let event = new CustomEvent("exportTheMap");
    document.dispatchEvent(event);
}

//dispatches an event to the importer to import a map and dispatch to the editor
function importMap() {
    //dispach event to the document to tell the importer to import a map
    let event = new CustomEvent("importTheMap");
    document.dispatchEvent(event);
}

//used by feature buttons to communicate with the editor what state it needs to go to for the map
function changeEditorState(name, action, newState) {
    //dispatch event to the document to tell the Editor to change the maps OnClick State a map
    let event = new CustomEvent("editorStateChange", {detail:{
        name: name,
        action: action,
        state: newState,
    }});
    document.dispatchEvent(event);
}

function closePropertyEditor()
{
    //dispatch event to the document to tell the Editor to close the properties editor
    let event = new CustomEvent("closePropertyEditor");
    document.dispatchEvent(event);
}

function updatePropertyEditor()
{
    //dispatch event to the document to tell the Editor to update the properties editor
    let event = new CustomEvent("updatePropertyEditor");
    document.dispatchEvent(event);
}

function updateFeatureProperties(guid, propertyName, propertyValue)
{
    //dispatch event to the document to tell the Editor to update the feature properties
    let event = new CustomEvent("updateFeatureProperties", {detail:{
        "guid": guid,
        "propertyName": propertyName,
        "propertyValue": propertyValue,
    }});
    document.dispatchEvent(event);
}