"use strict";
import * as EZAS from "./Requirements.js";

//listen for if we need to import a map
document.addEventListener("importTheMap", (e) => {
    importMap();
});

//function that converts a csv file into an array
function csvToArray(str, delimiter = ",") {

    const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);

    const rows = str.slice(str.indexOf("\n") + 1).split("\r\n");

    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      //console.log(values);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });

    arr.splice((arr.length - 1), 1);
    return arr;
  }

  //function that sends an event to clear the map before importing
  function clearMap(){
    let event = new CustomEvent("clearMap");
    document.dispatchEvent(event);
  }

//import the map and then tell the editor that it needs to update the map
function importMap() {
    clearMap();
    //the map that is built by the importer based on JSON and dispatched to the editor when the import is done
    let clicker = new EZAS.PsuedoMapInteract();
    let listOfHeaders = ["Person", "Place", "Latitude", "Longitude", "FeatureType", "Color", "Radius", "Bound1Lat", "Bound1Lng", "Bound2Lat", "Bound2Lng"];   
    let iconColor;
    let fullDescription;

    //these are the colors for the icons since it would not change properly when given the color as an option below
    let purpleIcon = new L.icon({
        iconUrl: '../../../Resources/Features/Marker/Icons/default-purple.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize:  [41, 41]
    })

    let blueIcon = new L.icon({
        iconUrl: '../../../Resources/Features/Marker/Icons/default-blue.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize:  [41, 41]
    })

    let redIcon = new L.icon({
        iconUrl: '../../../Resources/Features/Marker/Icons/default-red.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize:  [41, 41]
    })

    let greenIcon = new L.icon({
        iconUrl: '../../../Resources/Features/Marker/Icons/default-green.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize:  [41, 41]
    })

    let yellowIcon = new L.icon({
        iconUrl: '../../../Resources/Features/Marker/Icons/default-yellow.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize:  [41, 41]
    })

    // This loads in the selected file and performs pseudoclicks based on the info in the file
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = ".csv";
    input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e){
            var text = e.target.result;
            var data = csvToArray(text);
            JSON.stringify(data);

            for (var i in data){
              var row = data[i];

              //this is to dynamically create the description by adding any headers and values that are not predefined to it
              fullDescription = "Place: " + String(row.Place);
              let keys = Object.keys(row);
              
              for (var j in keys){
                let keyHeader = String(keys[j]);
                if(!listOfHeaders.includes(keys[j])){
                    fullDescription += "\n" + keys[j] + ": " + row[keyHeader];
                }
              }

              //switch to change the color of the icon
              let colorstr = String(row.Color).toLowerCase();
              switch (colorstr){
                case "red":
                    iconColor = redIcon;
                    break;
                case "green":
                    iconColor = greenIcon;
                    break;
                case "yellow":
                    iconColor = yellowIcon;
                    break;
                case "purple":
                    iconColor = purpleIcon;
                    break;
                default:
                    iconColor = blueIcon;
              }

              //switch to change the feature type and do a pseudo click for that specific feature type
              let featureTypeStr = String(row.FeatureType).toLowerCase();
              switch (featureTypeStr){
                case "marker":
                    clicker.psuedoMapClick({lat:row.Latitude, lng:row.Longitude}, {title:row.Person, description:fullDescription, icon:iconColor}, "ADD_MARKER");
                    break;
                case "circle":
                    clicker.psuedoMapClick({lat:row.Latitude, lng:row.Longitude}, {title:row.Person, description:fullDescription, radius:row.Radius}, "ADD_CIRCLE");
                    break;
                case "rectangle":
                    let bound1Coords = new L.latLng(row.Bound1Lat, row.Bound1Lng);
                    let bound2Coords = new L.latLng(row.Bound2Lat, row.Bound2Lng);
                    let boundCoords = [bound1Coords, bound2Coords];
                    //console.log(boundCoords);
                    //clicker.psuedoMapClick({bound1Coords}, {title:row.Person, description:row.Place}, "ADD_RECTANGLE");
                    break;
                default:
                    clicker.psuedoMapClick({lat:row.Latitude, lng:row.Longitude}, {title:row.Person, description:fullDescription, icon:iconColor}, "ADD_MARKER");
              }
            }
        }
        reader.readAsText(file);
    }
    input.click();
}

function testMapParser() {
  let testMapJSON = {
      mapName: "imap",
      options: {
          zoom: 13,
          center: [51.505, -0.09],
          editable: true,
      },
      //Add the tile layers to the map
      tileLayer: {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          options: {
              maxZoom: 19,
              attribution: ":copyright: OpenStreetMap",
          },
      },
      features: [
          {
              type: "marker",
              LatLng: {
                  lat: 51.505,
                  lng: -0.09,
              },
              options: {
                  title: "testMarker",
                  icon: "DEFAULT-RED",
                  description: "this is a test marker",
              },
          },
      ],
  };
  let testMapJSONString = JSON.stringify(testMapJSON);
  let map = parseMapFromJSON(testMapJSONString);
  return map;
}

//takes a stringified JSON object and parses it into a map object
function parseMapFromJSON(mapJson) {
  //parse the json into an object
  let mapObject = JSON.parse(mapJson);
  //create the map
  let newMap = new EZAS.MapFeature(mapObject.mapName, mapObject.options);
  //add the tile layer
  L.tileLayer(mapObject.tileLayer.url, mapObject.tileLayer.options).addTo(
      newMap
  );
  //add the features
  mapObject.features.forEach((f) => {
      switch (f.type) {
          case "marker":
              f.options.icon = EZAS.MarkerFeature.icons[f.options.icon];
              let newMarker = new EZAS.MarkerFeature(f.LatLng, f.options);
              newMarker.addTo(newMap);
              //newMap.featureArray.push(newMarker);
              break;
          case "circle":
              throw new Error("Circles are not yet implemented");
              let newCircle = new EZAS.CircleFeature(f.LatLng, f.options);
              newCircle.addTo(newMap);
              break;
          case "rectangle":
              throw new Error("Rectangles are not yet implemented");
              let newRectangle = new EZAS.RectangleFeature(
                  f.LatLng,
                  f.options
              );
              newRectangle.addTo(newMap);
              break;
            case "polygon":
              throw new Error("Polygons are not yet implemented");
              let newPolygon = new EZAS.PolygonFeature(f.LatLng, f.options);
              newPolygon.addTo(newMap);
              break;
          case "polyline":
              throw new Error("Polylines are not yet implemented");
              let newPolyline = new EZAS.PolylineFeature(f.LatLng, f.options);
              newPolyline.addTo(newMap);
              break;
          default:
              break;
      }
  });
  return newMap;

}
