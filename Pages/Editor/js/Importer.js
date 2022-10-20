"use strict";
import * as EZAS from "./Requirements.js";

//listen for if we need to import a map
document.addEventListener("importTheMap", (e) => {
    importMap();
});

//function that converts a csv file into an array
function csvToArray(str, delimiter = ",") {

    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });

    return arr;
  }

//import the map and then tell the editor that it needs to update the map
function importMap() {

    //the map that is built by the importer based on JSON and dispatched to the editor when the import is done
    let clicker = new EZAS.PsuedoMapInteract();
    clicker.psuedoMapClick({lat:0.0, lng:0.0}, {title:"test", description:"test", radius:1000}, "ADD_CIRCLE");
    //let imap = testMapParser();

    //let event = new CustomEvent("updateMap", { detail: { map_object: imap } });
    //document.dispatchEvent(event);

    // Previous version of importmap(). Keeping for now in case it is needed later for some reason.
    // let gimap = new EZAS.MapFeature("imap", {});
    // var input = document.createElement('input');
    // input.type = 'file';
    // input.onchange = e => {
    //     var file = e.target.files[0];
    //     var reader = new FileReader();
    //     reader.onload = function (e){
    //         var text = e.target.result;
    //         var data = csvToArray(text);
    //         JSON.stringify(data);
            
    //         for (var i in data){
    //           var row = data[i];
    //           var marker = new google.maps.Marker({});
    //           var position = new google.maps.Latlng(row.Latitiude, row.Longitude);
    //         }
    //     }
    //     reader.readAsText(file);
    // }
    // input.click();
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
