let exportedMap = new ExportedMap("Map Title");
let IdGenerator = new IdGenerator();

// A function that takes an array of options and
// returns a button for each in html and returns it for use in the basic popup editor : Elliot 6/30/2022
function createPopupEditor(options) {
    let html = "";
    for (let i = 0; i < options.length; i++) {
        //adds buttons to the popup window that will run onclick functions
        //need to have the function create an element, add it to the map at the location of the click, add it to the embeddedMapElementsJSON, and give it a unique id
        html += `<button class='popup-button' id='${options[i]}' onClick='addElement(${options[i]})'>${options[i]}</button>`;
    }
    return html;
}

//has to be a global so that it can be accessed elsewhere : Elliot 7/5/2022
var map = L.map("map", {
    center: [51.505, -0.09],
    zoom: 13,
});

// initializes the map in the editor
// Returns a map object
// Elliot 6/30/2022
function initializeMap() {
    //initialize the map (needs to be var so it is globals)
    addTileLayer(map, "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
    }); //add the tile layer to the map
    return map;
}

function addTileLayer(map, tileLayer, options = {}) {
    //app the Map layer to the map
    L.tileLayer(tileLayer, options).addTo(map);
}

//make the controls in the leaflet js map with buttons for options in the popup : Elliot 7/5/2022
function onMapClick(e) {
    let options = ["Marker", "Polyline", "Polygon", "Circle", "Rectangle"];
    let popup = L.popup();
    popup
        .setLatLng(e.latlng)
        .setContent(createPopupEditor(options))
        .openOn(map);
}

//initialize the map in the editor
initializeMap();

//add a geojson feature
mapGeoJSON.addGeoJSONFeature({
    type: "Feature",
    geometry: {
        type: "Point",
        coordinates: [51.5, 0],
    },
    properties: {
        name: "Dinagat Islands",
        show_in_map: true,
    },
});

//add the geojson to the map
let geolayer = L.geoJSON().addTo(map);
geolayer.addData(mapGeoJSON.getGeoJSON()).addTo(map);

map.on("click", onMapClick);
