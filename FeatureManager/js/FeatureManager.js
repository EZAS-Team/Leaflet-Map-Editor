//Handles the inclusion of the feature support in the map editor: Elliot 7/6/2022
const supportedFeatures = {
    Marker: "marker.js",
    GeoJSON: "geoJSON.js",
};

//generates the script tags for all the features that are supported by default
//returns the string of html: Elliot 7/6/2022
function generateScriptTags(features = supportedFeatures) {
    let scriptTags = "";
    for (let feature in features) {
        let featurejs = features[feature];
        scriptTags += `<script id="${featurejs}_js" src="../../Features/{${feature}/js/${featurejs}"></script>`;
    }
    return scriptTags;
}

//add the tags to the html head : Elliot 7/6/2022
document.onload((e) => {
    document.getElementById("head").innerHTML += generateScriptTags();
});
