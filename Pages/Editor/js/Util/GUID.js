"use strict";
function generateGUID() {
    // generate a guid and return it
    let guid = "";
    for (let i = 0; i < 32; i++) {
        guid += Math.floor(Math.random() * 0xf).toString(0xf);
    }
    return guid;
}

//Create a new GUID object. If an id is passed in, use that, otherwise generate a new one.
class GUID {
    constructor(id = generateGUID()) {
        this.id = id;
    }

    get() {
        return this.id;
    }
}

export { GUID };
export default GUID;
