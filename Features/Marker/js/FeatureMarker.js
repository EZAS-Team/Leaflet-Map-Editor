`use strict`;
//The marker feature class used to create a marker and add it to the map : Elliot 7/5/2022
class FeatureMarker {
    //id needs to default to a new id but be able to be set to a specific id : Elliot 7/6/2022
    //objectParameters is an object with the following properties:
    //  - latlng: L.LatLng
    //  - options: L.Marker.Options
    constructor(objectParameters, id = Date.now()) {
        debugInfo("FeatureMarker constructor");
        this.marker = L.marker(
            objectParameters.latlng || [0, 0], //default to 0,0 if no latlng is provided : Elliot 7/7/2022
            objectParameters.options || {} //default to an empty object if no options are provided : Elliot 7/7/2022
        );
        debugInfo("FeatureMarker constructor: marker created");
        debugInfo(this.marker);
        this.exportDetails = {
            id: id, //always present in any features exportDetails : Elliot 7/7/2022
            type: "Marker", //always present in any features exportDetails, contents will vary : Elliot 7/7/2022
            //always present in any features exportDetails, contents will vary: Elliot 7/7/2022
            parameters: {
                latlng: objectParameters.latlng,
                options: objectParameters.options,
            },
            object: this.marker, //always present in any features exportDetails : Elliot 7/7/2022
        };
        debugInfo("FeatureMarker constructor: exportDetails created");
        debugInfo(this.exportDetails);
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
