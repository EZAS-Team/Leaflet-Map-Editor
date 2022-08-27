"use strict";
import FeatureTests from "../../Tests/tests.js";
const run = () => {
    FeatureTests.forEach((test) => {
        console.log(test());
    });
};

export default run;
