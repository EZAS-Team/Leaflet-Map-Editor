"use strict";
import * as EZAS from "../js/Requirements.js";
//let gemap;

class ExportFeature{
    map;
    markers;
    exportInfo;

    constructor (gemap) {
        this.map = gemap;
        this.markers = new Array();
        this.exportInfo = '';
    }

    getMarkersFromMap(){
        let temp = [];
        this.map.eachLayer( function(layer){
            if(layer instanceof EZAS.MarkerFeature){
                temp.push(layer);
            }
        });

        this.markers = temp;
        
    }

    getMap(){
        return this.map;
    }

    getMarkers(){
        return this.markers;
    }

    getExportInfo(){
        return this.exportInfo;
    }

    parseExportInfo(){
        let info = '';
        this.exportInfo += '{ "markers" : [';
        for (let i=0; i < this.markers.length; i++){
            info = '';
            if(i===this.markers.length -1){
                this.exportInfo += '{ "Lat":"'+ this.markers[i].getLatLng().lat.toString() + '" , ';
                this.exportInfo += '"Long":"' + this.markers[i].getLatLng().lng.toString() + '" } ]}';
            }
            else{
                //Pulls Latitude value from getLatLng()
                this.exportInfo += '{ "Lat":"'+ this.markers[i].getLatLng().lat.toString() + '" , ';
                this.exportInfo += '"Long":"' + this.markers[i].getLatLng().lng.toString() + '" },';
                //Pulls Longitude value from getLatLng()

            }
        }    
    }


}

//listens for an event that tells it to export the map given by the event
document.addEventListener("exportMap", (e) => {
    //gemap = e.detail.map_object;
    let gemap;
    gemap = new ExportFeature(e.detail.map_object);
    exportMap(gemap);
    //testGemap();
});

//gmap test
function testGemap()
{
    console.assert(gemap != undefined, "gemap is undefined");
    console.assert(gemap != null, "gemap is null");
    console.assert(gemap instanceof EZAS.MapFeature, "gemap is not an instance of MapFeature");
}

//exports the map
function exportMap(gemap) {
    gemap.getMarkersFromMap();
    gemap.parseExportInfo();
    let test = JSON.parse(gemap.getExportInfo());
    //console.log(test);
    console.log("Preparing export file");
    var exportFilename = prompt("Filename for map");
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/json;charset=utf-8, ' + encodeURI(test);
    hiddenElement.target = '_blank';
    exportFilename += '.json';
    hiddenElement.download = exportFilename;
    hiddenElement.click();

}