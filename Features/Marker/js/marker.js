//The marker feature class used to create a marker and add it to the map : Elliot 7/5/2022
class Marker{
    constructor(latlng, options) {
        this.marker = {
            id: IdGenerator.getId(),
            type: "Marker",
            parameters: {
                latlng: latlng,
                options: options,
            },
        };
    }

    //Adds a marker to the Map that will be exported using the ExportedMap utility
    addToExport() {
        ExportedMap.addMapElement(this.marker);
    }
}
