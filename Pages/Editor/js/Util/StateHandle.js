"use strict";
class StateHandle {
    constructor(initialStates) {
        this.states = initialStates;
        this.initialStates = initialStates;
    }
    getState(name) {
        return this.states[name];
    }
    setState(name, state) {
        this.states[name] = state;
    }
    resetState(name) {
        if (this.states[name + "_default"] === undefined) {
            //set the state to the initial state if there is no default state
            this.states[name] = this.initialstates[name];
        } else {
            //set the state to the default state if there is one
            this.states[name] = this.states[name + "_default"];
        }
    }
}
export { StateHandle };
export default StateHandle;
