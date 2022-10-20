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
        if ((this.initialStates[name + "_default"])) {
            //set the state to the initial state if there is no default state
            this.states[name] = this.initialStates[name+"_default"];
        } else
        {
            //set the state to the initial state if there is no default state
            this.states[name] = this.initialStates[name];
        }
    }
}
export { StateHandle };
export default StateHandle;
