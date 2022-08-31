"use strict";
//This file contains the callback functions for the Editor page and cant be a module
//dispatches an event to the Editor telling it to dispatch an event with the map object
function exportMap() {
    //dispach event to export map with the map object
    let event = new CustomEvent("exportTheMap");
    window.dispatchEvent(event);
}

//dispatches an event to the importer to import a map and dispatch to the editor
function importMap() {
    //dispach event to the window to tell the importer to import a map
    let event = new CustomEvent("importTheMap");
    window.dispatchEvent(event);
}

//used by feature buttons to communicate with the editor what state it needs to go to for the map
function changeEditorState(name, action, newState) {
    //dispatch event to the window to tell the Editor to change the maps OnClick State a map
    let event = new CustomEvent("editorStateChange", {
        name: name,
        action: action,
        state: newState,
    });
    window.dispatchEvent(event);
}
