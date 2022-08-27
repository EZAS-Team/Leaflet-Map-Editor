"use strict";
//The marker feature class used to create a marker and add it to the map : Elliot 7/5/2022
import { Debug } from "../../../Util/js/requirements.js";

class FeatureMarker {
    //id needs to default to a new id but be able to be set to a specific id : Elliot 7/6/2022
    //objectParameters is an object with the following properties:
    //  - latlng: L.LatLng
    //  - options: L.Marker.Options
    constructor(
        objectParameters = { latlng: new L.LatLng(0, 0), options: {} },
        id = Date.now() + Math.random()
    ) {
        Debug.debugInfo("FeatureMarker constructor");
        this.type = "Marker";
        this.id = id;
        this.objectParameters = objectParameters;
        this.marker = new L.Marker(
            objectParameters.latlng, //default to 0,0 if no latlng is provided : Elliot 7/7/2022
            objectParameters.options //default to an empty object if no options are provided : Elliot 7/7/2022
        );
        Debug.debugInfo("FeatureMarker constructor: marker created");
        Debug.debugInfo(this.marker);
        this.exportDetails = {
            id: this.id, //always present in any features exportDetails : Elliot 7/7/2022
            type: this.type, //always present in any features exportDetails, contents will vary : Elliot 7/7/2022
            //always present in any features exportDetails, contents will vary: Elliot 7/7/2022
            parameters: this.objectParameters,
            object: this.marker, //always present in any features exportDetails : Elliot 7/7/2022
        };
        Debug.debugInfo("FeatureMarker constructor: exportDetails created");
        Debug.debugInfo(this.exportDetails);
    }
    //returns the object that will be exported: Elliot 7/6/2022
    getExportDetails() {
        return this.exportDetails;
    }

    //returns the object can be added to a map : Elliot 7/7/2022
    getObject() {
        return this.exportDetails.object;
    }

    //returns the Marker that can be added to the map
    //included for readablility: Elliot 7/6/2022
    getMarker() {
        return this.getObject();
    }

    //latlng is a L.latlng type
    //sets the latlng in the exportDetails
    //and updates the marker : Elliot 7/7/2022
    setLatLng(latlng) {
        this.exportDetails.parameters.latlng = latlng;
        this.exportDetails.object.setLatLng(latlng);
    }

    //each option must be set individually rather than in bulk: Elliot 7/7/2022
}

//trigger an open edit panel event when the marker is clicked to open the edit panel with the marker's data
function openEdit() {
    let event = new CustomEvent("openEdit", { detail: this });
    document.dispatchEvent(event);
}

//define the marker init hook
function MarkerInitHook() {
    //add an event listener to the marker to open a popup when clicked
    this.on("click", (e) => {
        openEdit();
    });
    //add the marker to the mapFeatures array when added to the map
    this.on("add", (e) => {
        mapFeatures.push(this);
    });
    //remove the marker from the mapFeatures array when removed from the map
    this.on("remove", (e) => {
        mapFeatures.splice(mapFeatures.indexOf(this), 1);
    });
}

//add the init hook to the marker class
L.Marker.addInitHook(MarkerInitHook);

//export the class : Elliot 8/26/2022
export default FeatureMarker;
