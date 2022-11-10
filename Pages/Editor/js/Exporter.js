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

function markersToFile(content, gemap){
    let i;
    let numberOfMarkers;
    numberOfMarkers = gemap.getMarkers().length;
    //console.log(numberOfMarkers);
    //content += "        L.marker([51.5, -0.09]).addTo(map);
    for( i = 0; i < numberOfMarkers; i++){
        content += "        L.marker([" + gemap.getMarkers()[i].getLatLng().lat.toString();
        content += ", " + gemap.getMarkers()[i].getLatLng().lng.toString();
        content += "]).addTo(map);\n";
    }

    return content;
}

function parseDescription(description){
    let descArray = description.split('\n');
    let result = '"';
    let i;

    for(i = 0; i < descArray.length; i++){
        descArray[i].trim();
        if(i == descArray.length - 1){
            if(descArray[i].length > 0){
                result += descArray[i].substring(0, descArray[i].indexOf(':'));
                result += ':';
                result += descArray[i].substring(descArray[i].indexOf(':') + 2, descArray[i].length);
                result += '"';
            }
            else{
                result = result.substring(0, result.length -1);
                result += '"';
            }
        }
        else{
            result += descArray[i].substring(0, descArray[i].indexOf(':'));
            result += ':';
            result += descArray[i].substring(descArray[i].indexOf(':') + 2, descArray[i].length);
            result += ';';
        }

    }

    console.log(result);
    /*
    let result = '';
    let temp = '';
    result += '"';
    result += description.substring(0, description.indexOf(':'));
    temp = description.substring(description.indexOf(':'), description.length - 1);
    result += temp.substring(0, temp.indexOf('\n'));
    result += ';';
    temp = temp.substring(temp.indexOf('\n'), temp.length -1);
    console.log(temp);
    */

    return result;
    
}

//exports the map
function exportMap(gemap) {
    var itemsFormatted = [];
    gemap.getMarkersFromMap();
    gemap.parseExportInfo();
    let test = JSON.parse(gemap.getExportInfo());
    console.log(gemap.getMap().featureArray.length);
    var exportFileName = prompt("Filename for map");
    var headers = {
        Title: 'Title'.replace(/,/g, ''),
        Description: 'Description',
        Latitude: 'Latitude',
        Longitude: 'Longitude',
        FeatureType: 'FeatureType',
        Color: 'Color',
        Radius: 'Radius',
        Bound1Lat: 'Bound1Lat',
        Bound1Lng: 'Bound1Lng',
        Bound2Lat: 'Bound2Lat',
        Bound2Lng: 'Bound2Lng'

    };

    let keys = Object.keys(gemap.getMap().featureArray.length);
    console.log(keys);
    let filler = '';

    gemap.getMap().featureArray.forEach((item) => {
        //console.log(item.getLatLng().lat.toString());
        if(item instanceof EZAS.MarkerFeature){
            console.log(parseDescription(item.options.description));
            itemsFormatted.push({
                Title: item.options.title.replace(/,/g, ''),
                Description: parseDescription(item.options.description),
                Latitude: item.getLatLng().lat.toString(),
                Longitude: item.getLatLng().lng.toString(),
                FeatureType: 'Marker',
                Color: item.options.iconType,
                Radius: filler,
                Bound1Lat: filler,
                Bound1Lng: filler,
                Bound2Lat: filler,
                Bound2Lng: filler
            });
        }
        else if(item instanceof EZAS.CircleFeature){
            console.log("This is a circle");
            console.log(item.options.title);
            console.log(item.options.description);
            console.log(item.options.radius);
            console.log(item.getLatLng().lat.toString());
            console.log(item.getLatLng().lng.toString());
            itemsFormatted.push({
                Title: item.options.title.replace(/,/g, ''),
                Description: parseDescription(item.options.description),
                Latitude: item.getLatLng().lat.toString(),
                Longitude: item.getLatLng().lng.toString(),
                FeatureType: 'Circle',
                Color: filler,
                Radius: item.options.radius,
                Bound1Lat: filler,
                Bound1Lng: filler,
                Bound2Lat: filler,
                Bound2Lng: filler
            });
        }
        else if(item instanceof EZAS.MapFeature){
            console.log("This is the map");
        }
        else if(item instanceof EZAS.RectangleFeature){
            console.log("This is a rectangle");
        }
        else{
            console.log("Unknown feature");
        }
    });

    exportCSVFile(headers, itemsFormatted, exportFileName);
    var mapElement = document.getElementById("map").innerHTML;
    mapElement = mapElement.substring(96);

    var content = "<!DOCTYPE html>\n<html>\n    <head id=\"head\">";
    content += "<!-- Start of remove required for leaflet -->\n";
    content += "    <link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.8.0/dist/leaflet.css\" integrity=\"sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==\" crossorigin=\"\" />"
    content += "     <!-- Make sure you put this AFTER Leaflet's CSS -->\n";
    content += "    <script\n";
    content += "        src=\"https://unpkg.com/leaflet@1.8.0/dist/leaflet.js\"\n";
    content += "        integrity=\"sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==\"\n";
    content += "        crossorigin=\"\">\n";
    content += "    </script><!-- End of remote required for leaflet -->\n";
    content += "    </head>\n";
    content += "    <body>\n";
    //content += mapElement;
    content += "\n";
    content += "    <div id=\"map\" style=\"width: 1000px; height: 600px\"></div>\n";
    content += "    <script>\n";
    content += "        var map = L.map(\'map\').setView([51.505, -0.09], 13);\n\n";
    content += "        L.tileLayer(\'https://tile.openstreetmap.org/{z}/{x}/{y}.png\', {\n";
    content += "            maxZoom: 19,\n";
    content += "            attribution: \'&copy; OpenStreetMap\'\n";
    content += "            }).addTo(map);\n\n";
    content = markersToFile(content, gemap);
    content += "\n  </script>\n"
    //content += "        L.marker([51.5, -0.09]).addTo(map);\n</script>\n"
    content += "    </body>\n</html>"

    //Same process as .csv export
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', exportFileName + '.html');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}