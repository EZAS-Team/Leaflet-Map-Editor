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


function testGemap()
{
    console.assert(gemap != undefined, "gemap is undefined");
    console.assert(gemap != null, "gemap is null");
    console.assert(gemap instanceof EZAS.MapFeature, "gemap is not an instance of MapFeature");
}

function toCSV(test){
    var array = typeof objArray != 'object' ? JSON.parse(test) : test;
    var str = '';

    for (var i = 0; i < array.length; i++){
        var line = '';

        for (var index in array[i]) {
            if (line != '') {
                line += ',';
            }
            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    var jsonObject = JSON.stringify(items);

    var csv = toCSV(jsonObject);

    var exportedFileName = fileTitle + '.csv' || 'map-export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;'});
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, exportedFileName);
    }
    else{
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

//exports the map
function exportMap(gemap) {
    var itemsFormatted = [];
    gemap.getMarkersFromMap();
    gemap.parseExportInfo();
    let test = JSON.parse(gemap.getExportInfo());
    //console.log(test);
    console.log("Preparing export file");
    var exportFileName = prompt("Filename for map");
    var headers = {
        Lat: 'Latitude'.replace(/,/g, ''),
        Long: "Longitude"

    };

    gemap.getMarkers().forEach((item) => {
        console.log(item.getLatLng().lat.toString());
        itemsFormatted.push({
            Lat: item.getLatLng().lat.toString().replace(/,/g, ''),
            Long: item.getLatLng().lng.toString()
        });
    });

    exportCSVFile(headers, itemsFormatted, exportFileName);
    var mapElement = document.getElementById('map').innerHTML;
    var mapFileName = "map.html";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/html, ' + mapElement);
    element.setAttribute('download', mapFileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

}