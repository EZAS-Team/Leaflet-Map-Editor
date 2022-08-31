"use strict";
class Debug {
    static debug = true;
    constructor() {}
    setDebug(debug) {
        this.debug = debug;
    }
    getDebug() {
        return this.debug;
    }
    log(message) {
        if (this.debug) {
            console.log(message);
        }
    }
    error(message) {
        if (this.debug) {
            console.error(message);
        }
    }
    warn(message) {
        if (this.debug) {
            console.warn(message);
        }
    }
    info(message) {
        if (this.debug) {
            console.info(message);
        }
    }
}

export { Debug };
export default Debug;
