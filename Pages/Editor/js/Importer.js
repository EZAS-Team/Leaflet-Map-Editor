"use strict";
import * as EZAS from "./Requirements.js";

//listen for if we need to import a map
document.addEventListener("importTheMap", (e) => {
    importMap();
});

function parseCSV(str) {
    var arr = [];
    var quote = false;  // 'true' means we're inside a quoted field

    // Iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // Current character, next character
        arr[row] = arr[row] || [];             // Create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

        
        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        
        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }
        
        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }
        
        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        //if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; } if (cc == '\n' && !quote) { ++row; col = 0; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}

//function to convert csv into an map
function csvToMap(str, delimiter = ",") {

    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    //const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);

    //parse the csv into an array using the parseCSV function
    const rows = parseCSV(str);
    //get the headers from the first row
    const headers = rows[0];
    //remove the headers from the rows array
    rows.shift();

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    //const rows = str.slice(str.indexOf("\n") + 1).split("\r\n");

    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
      const values = row;
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });

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
    let listOfHeaders = ["Title", "Description", "Latitude", "Longitude", "FeatureType", "Color", "Radius", "Bound1Lat", "Bound1Lng", "Bound2Lat", "Bound2Lng", "ImageURL"];   
    let iconColor;
    let iconName;
    let hexStrokeColor;
    let fullDescription;
    let genDescription;
    let providedDescription;

    //these are the colors for the icons since it would not change properly when given the color as an option below
    let purpleIcon = EZAS.MarkerFeature.icons["DEFAULT-PURPLE"];
    let redIcon = EZAS.MarkerFeature.icons["DEFAULT-RED"];
    let blueIcon = EZAS.MarkerFeature.icons["DEFAULT-BLUE"];
    let greenIcon = EZAS.MarkerFeature.icons["DEFAULT-GREEN"];
    let yellowIcon = EZAS.MarkerFeature.icons["DEFAULT-YELLOW"];

    // This loads in the selected file and performs pseudoclicks based on the info in the file
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = ".csv";
    input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e){
            var text = e.target.result;
            var data = csvToMap(text);
            JSON.stringify(data);

            for (var i in data){
              var row = data[i];
            
              //check to remove any quotes in the titles
              let heads = Object.keys(row);
              for(let head in heads){
                let checkHead = String(heads[head]);
                if(checkHead.toLowerCase() == "title"){
                    let checkValue = String(row[checkHead]);
                    while(checkValue.includes("\"")){
                        checkValue = checkValue.replace("\"", "");
                        row[checkHead] = checkValue;
                    }
                }
              }

              //this is to dynamically create the description by adding any headers and values that are not predefined to it
              fullDescription = "";
              genDescription = "";
              providedDescription = "";
              let keys = Object.keys(row);
              
              for (let key in keys){
                let keyHeader = String(keys[key]);
                if(keyHeader=="Description")
                {
                    providedDescription = String(row[keyHeader]) + "\n";
                    providedDescription = providedDescription.replaceAll(":", ": ");
                    providedDescription = providedDescription.replaceAll(";", "\n");
                }
                if(!listOfHeaders.includes(keyHeader)){
                    genDescription += keyHeader + ": " + row[keyHeader] + "\n";
                }
              }
              fullDescription = providedDescription + genDescription;

              //switch to change the color of the icon
              let colorstr = String(row.Color).toLowerCase();
              switch (colorstr){
                case "default-red":
                case "red":
                    iconColor = redIcon;
                    iconName = "DEFAULT-RED";
                    hexStrokeColor = "#ff0000";
                    break;
                case "default-green":
                case "green":
                    iconColor = greenIcon;
                    iconName = "DEFAULT-GREEN";
                    hexStrokeColor = "#00ff00";
                    break;
                case "default-yellow":
                case "yellow":
                    iconColor = yellowIcon;
                    iconName = "DEFAULT-YELLOW";
                    hexStrokeColor = "#FFFF00";
                    break;
                case "default-purple":
                case "purple":
                    iconColor = purpleIcon;
                    iconName = "DEFAULT-PURPLE";
                    hexStrokeColor = "#A020F0";
                    break;
                default:
                    iconColor = blueIcon;
                    iconName = "DEFAULT-BLUE";
                    hexStrokeColor = "#3388FF";
              }

              //switch to change the feature type and do a pseudo click for that specific feature type
              let featureTypeStr = String(row.FeatureType).toLowerCase();
              switch (featureTypeStr){
                case "marker":
                    clicker.psuedoMapClick({lat:row.Latitude, lng:row.Longitude}, {title:row.Title, description:fullDescription, icon:iconColor, iconType:iconName, imageURL:row.ImageURL}, "ADD_MARKER");
                    break;
                case "circle":
                    clicker.psuedoMapClick({lat:row.Latitude, lng:row.Longitude}, {title:row.Title, description:fullDescription, radius:row.Radius, color:hexStrokeColor}, "ADD_CIRCLE");
                    break;
                case "rectangle":
                    let bound1Coords = new L.latLng(row.Bound1Lat, row.Bound1Lng);
                    let bound2Coords = new L.latLng(row.Bound2Lat, row.Bound2Lng);
                    let boundCoords = [bound1Coords, bound2Coords];
                    clicker.psuedoMapClick({bound1Coords}, {bounds:boundCoords, title:row.Title, description:fullDescription, color:hexStrokeColor}, "ADD_RECTANGLE");
                    break;
                default:
                    clicker.psuedoMapClick({lat:row.Latitude, lng:row.Longitude}, {title:row.Title, description:fullDescription, icon:iconColor, iconType:iconName, imageURL:row.ImageURL}, "ADD_MARKER");
              }
            }
        }
        reader.readAsText(file);
    }
    input.click();
}
