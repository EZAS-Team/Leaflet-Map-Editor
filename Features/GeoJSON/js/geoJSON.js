//handles interacting with the maps geoJSON : Elliot 7/5/2022
class geoJSON{
    constructor() {
        this.geoJSON = {
            type: "FeatureCollection",
            features: [],
        };
    }

    //returns true if the geojson is valid
    validateGeoJson(geojson) {
        return true;
    }

    //add a feature to the geojsonFeatureCollection: Elliot 7/5/2022
    addGeoJSONFeature(geojson) {
        //if the geojson is invalid, return undefined
        if (!this.validateGeoJson(geojson)) return undefined;
        this.geoJSON.features.push(geojson);
    }

    //returns the geojson
    getGeoJSON() {
        return this.geoJSON;
    }

    //reset the geojson to an empty feature collection
    resetGeoJSON() {
        this.geoJSON.features = [];
    }
}
