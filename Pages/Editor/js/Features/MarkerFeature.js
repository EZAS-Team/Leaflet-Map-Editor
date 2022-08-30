"use strict";
import * as EditorRequirements from "./EditorRequirements.js";
import { GUID } from "./Requirements.js";
//Marker Feature with a property editor
class MarkerFeature extends L.Marker {
    constructor(latlng, options, guid = new GUID()) {
        super(latlng, options);
        this.marker = this; //reference to the marker object (Self due to extending L.Marker)
        this.guid = guid; //GUID object for the marker
        this.propertyEditor = new EditorRequirements.FeaturePropertyEditor(
            this.marker,
            [new EditorRequirements.EditableField("Marker Name", "string")]
        );
        this.propertyEditor.open();
    }
}
export { MarkerFeature };
export default MarkerFeature;
