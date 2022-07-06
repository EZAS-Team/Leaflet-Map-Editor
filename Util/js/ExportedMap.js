//Class that handles the interaction with the map that is planned to be exported during editing
//Note: this is not the MapExporter as this simply handles the interaction with the map that will be exported
//by the MapExporter : Elliot 7/5/2022
class ExportedMap {
    constructor(title) {
        //conversion table for the map element types values are the set to defaults, if not posibble undefined is used instead (temp location)
        this.conversionTable = {
            MapElements: {
                Marker: {
                    LatLng: [
                        50, //latitude
                        30, //longitude
                    ],
                    options: {
                        icon: undefined,
                        keyboard: true,
                        title: "",
                        alt: "Marker",
                        zIndexOffset: 0,
                        opacity: 1.0,
                        riseOnHover: false,
                        riseOffset: 250,
                        pane: "markerPane",
                        shadowPane: "shadowPane",
                        bubblingMouseEvents: false,
                        autoPanOnFocus: true,
                        draggable: false,
                        autoPan: false,
                        autoPanPadding: L.Point(50, 50),
                        autoPanSpeed: 10,
                    },
                    js: `L.marker(${this.LatLng},${this.Options}).addTo(map);`,
                },
            },
        };

        //blank html for exported maps
        this.blankHTML = `
        <!-- Map generated by MapEditor.js -->
        <html>
            <head>
                <title>${this.title}</title>
                <!-- Start of required for leaflet -->
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
                    integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
                    crossorigin=""
                />
                <!-- Make sure you put this AFTER Leaflet's CSS -->
                <script
                    src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
                    integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
                    crossorigin=""
                ></script>
                <!-- End of required for leaflet -->
                <!-- used to allow for importing maps that have been created before -->
                <script id="embeddedMapElementsJSON">${this.embeddedMapElementsJSON}</script>
            </head>
            <body>
                <div id="map">
                    <!-- Map is created and configured in the script tag -->
                    <script>${this.mapEmbeddedJs}</script>
                </div>
            </body>
        </html>`;
        this.title = title; //the title of the map
        //used to store elements in the map with all of their properties so that importing does not require
        //any parsing of the html
        this.embeddedMapElementsJSON = {};
        this.mapEmbeddedJs = ""; //the js for the map that is embedded in the html
    }
    //returns the html for the map with the current values included
    getMap() {
        //converts the embeddedMapElementsJSON to a string that is the js for the map
        this.mapEmbeddedJs = convertEmbeddedMapElementsJSONToEmbeddedMapJs(
            this.embeddedMapElementsJSON
        );
        return this.blankHTML;
    }
    //adds an element to the map by adding it to the embeddedMapElementsJSON and the displayed map
    addMapElement(mapElement)
    {
        mapElement.
    }

    //sets the map title
    setTitle(title) {
        this.title = title;
    }

    convertEmbeddedMapElementsJSONToEmbeddedMapJs(embeddedMapElementsJSON) {
        let js = "";
        foreach(mapElement in embeddedMapElementsJSON);
        {
            //convert the mapElement to a js object and add it to the js string
            js += convertMapElementToJs(mapElement);
        }
        return this.js;
    }

    convertMapElementToJs(mapElement) {
        //get the default js for the map element type
        mapElementObject = conversionTable["MapElements"][mapElement.type];
    }
}
