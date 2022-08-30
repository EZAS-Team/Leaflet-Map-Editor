"use strict";
import * as EZAS from "./Requirements.js";
//extends the leaflet class to add a guid property to leaflet objects
class Feature {
    constructor(id = new EZAS.GUID()) {
        if (typeof id !== "object") {
            throw new Error("id must be an GUID object");
        }
        this.id = id;
    }
    getGUID() {
        return this.id;
    }
    get guid() {
        return this.id;
    }
}

export { Feature };
export default Feature;
