"use strict";
//included for debugging purposes
const DEBUGGING = true; //set to true to enable debugging logging

const debugError = (error) => {
    if (DEBUGGING) {
        console.error(error);
    }
};

const debugLog = (log) => {
    if (DEBUGGING) {
        console.log(log);
    }
};

const debugWarn = (warn) => {
    if (DEBUGGING) {
        console.warn(warn);
    }
};

const debugInfo = (info) => {
    if (DEBUGGING) {
        console.info(info);
    }
};

export { debugError, debugLog, debugWarn, debugInfo };
