//included for debugging purposes
const DEBUGGING = true; //set to true to enable debugging logging

function debugError(error) {
    if (DEBUGGING) {
        console.error(error);
    }
}

function debugLog(log) {
    if (DEBUGGING) {
        console.log(log);
    }
}

function debugWarn(warn) {
    if (DEBUGGING) {
        console.warn(warn);
    }
}

function debugInfo(info) {
    if (DEBUGGING) {
        console.info(info);
    }
}
