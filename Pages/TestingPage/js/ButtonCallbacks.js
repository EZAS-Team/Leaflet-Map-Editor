"use strict";
const testAllEvent = new Event("testAllEvent");

function allTests() {
    window.dispatchEvent(testAllEvent);
}
