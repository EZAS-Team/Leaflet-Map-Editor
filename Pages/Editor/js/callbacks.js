"use strict";
//This file contains the callback functions for the Editor

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
