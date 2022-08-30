import { latLng } from "leaflet";

window.addEventListener("importMap", (e) => { importMap(); });

function importMap() {
    //dispach event to import map with the map object

    
}
//converting json to leaflet
function initization(json) {


if (json.type) === "marker" 
{
    let marker = new MarkerFeature(latLng, options);
    marker.addTo(map);
}
}