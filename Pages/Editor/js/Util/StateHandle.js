"use strict";
class StateHandle {
    constructor(initialStates) {
        this.states = initialStates;
    }
    getState(name) {
        return this.states[name];
    }
    setState(name, state) {
        this.states[name] = state;
    }
    resetState(name) {
        if (this.states[name + "_default"] === undefined) {
            this.states[name] = this.states[name].initialStates;
        } else {
            this.states[name] = this.states[name + "_default"];
        }
    }
}
export { StateHandle };
export default StateHandle;
