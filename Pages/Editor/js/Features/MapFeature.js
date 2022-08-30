"use strict";
import * as EditorRequirements from "./EditorRequirements.js";
import { GUID } from "./Requirements.js";
//Map class
class MapFeature extends L.Map {
    constructor(id, options) {
        super(id, options);
        this.guid = new GUID();
    }
}

export { MapFeature };
export default MapFeature;
