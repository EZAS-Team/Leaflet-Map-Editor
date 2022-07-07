//The marker feature class used to create a marker and add it to the map : Elliot 7/5/2022
class FeatureMarker {
    //id needs to default to a new id but be able to be set to a specific id : Elliot 7/6/2022
    constructor(latlng, options, id = Date.now()) {
        this.exportDetails = {
            id: id,
            type: "Marker",
            parameters: {
                latlng: latlng,
                options: options,
            },
        };
        this.marker = L.marker(latlng, options);
    }
    //Adds a marker to the Map that will be exported using the ExportedMap utility : Elliot 7/6/2022
    addToExport() {}
    //returns the Marker that can be added to the map : Elliot 7/6/2022
    getMarker() {
        return this.marker;
    }
}
