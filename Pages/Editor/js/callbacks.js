function exportMap()
{
    //dispach event to export map with the map object
    let event = new CustomEvent("exportMap", { detail: map });
    window.dispatchEvent(event);
}

function importMap()
{
    //dispach event to import map with the map object
    let event = new CustomEvent("importMap");
    window.dispatchEvent(event);
}


