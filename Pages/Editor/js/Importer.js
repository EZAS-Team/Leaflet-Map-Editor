import * as EZAS from "./Requirements";

window.addEventListener("importMap", (e) => { importMap(); });

let map = new EZAS.Map("map", {});

//dispach event to import map with the map object
function importMap() 
{
    
    //dispach event to that an import has occured and the map should be imported
    let event = new CustomEvent("importFinished", { detail: map});
    window.dispatchEvent(event);
}