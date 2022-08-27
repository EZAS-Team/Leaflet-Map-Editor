"use strict";
import { Tester } from "../../../Util/js/Tester.js";
function testAll() {
    
    let tester = new Tester();
    tester.run();
    tester.printResults();
}

//listens for the testAllEvent and runs the tests
window.addEventListener(
    "testAllEvent",
    (e) => {
        testAll();
    },
    false
);
