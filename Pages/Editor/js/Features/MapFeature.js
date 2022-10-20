"use strict";
import * as EditorRequirements from "../EditorRequirements.js";
import { GUID } from "../Requirements.js";
import { StateHandle } from "../Requirements.js";
import {
    MarkerFeature,
    PolylineFeature,
    PolygonFeature,
    CircleFeature,
    RectangleFeature,
} from "../Requirements.js";

//Map class
class MapFeature extends L.Map {
    static initialStates = {
            OnClick: "NONE",
            OnDoubleClick: "NONE",
            OnMouseMove: "NONE",
            OnMouseDown: "NONE",
            OnMouseUp: "NONE",
            OnMouseOver: "NONE",
            OnMouseOut: "NONE",
            OnContextMenu: "NONE",
            OnDrag: "NONE",
            OnDragEnd: "NONE",
            OnDragStart: "NONE",
            OnZoom: "NONE",
            OnZoomEnd: "NONE",
            OnZoomStart: "NONE",
            OnViewReset: "NONE",
            OnMoveEnd: "NONE",
            OnMoveStart: "NONE",
            OnMove: "NONE",
            OnAdd: "NONE",
            OnRemove: "NONE",
            OnPopupOpen: "NONE",
            OnPopupClose: "NONE",
            OnPreclick: "NONE",
        };
    constructor(id, options, guid = new GUID()) {
        super(id, options);
        this.guid = guid.get;
        this.eventTarget = new EventTarget();
        this.stateHandle = new StateHandle(MapFeature.initialStates);
        this.featureArray = [];
        this.featuresAdded = 0;
        //listen for a map state change event set to the and change the state of all the map states
        document.addEventListener("mapStateChange", (e) => {
            let event = new customEvent("mapStateChange", {detail:e});
            this.eventTarget.dispatchEvent(event);
        }, true); //capture the event so it can be stopped from bubbling up
        //allows for each map to be able to change states individually
        this.eventTarget.addEventListener("mapStateChange", (e) => { 
            this.stateHandle.setState(e.detail.action, e.detail.state); 
        }, true); //capture the event so that it can be stopped from bubbling up
        
        this.addEventListener("click", (e) => {
            this.OnClick(e);
        }, false); //don't capture the event so that it can bubble up to the document
        this.self = this;
    }

    //This function sets the objects feature array to the passed in array of features
    //it does not update the map with the new features
    //It is used to maintain a copy of the feature array used by the editor
    updateFeatureArray(featureArray)
    {
        console.debug(`Updating ${this.guid} Map feature array with ${featureArray}`);
        this.featureArray = featureArray;
    }

    //resets the named state in the state handle to the default state
    resetState(name)
    {
        console.debug(`Resetting ${this.guid} Map state ${name} to back to default state from ${this.stateHandle.getState(name)}`);
        this.stateHandle.resetState(name);
    }

    OnClick(e) {
        console.debug(`Map ${this.guid} OnClick event fired`);
        let mapState = this.stateHandle.getState("OnClick");
        switch (mapState) {
            case "NONE":
                break;
            //below cases are the states implemetned by the editor
            case "ADD_MARKER":
            case "ADD_CIRCLE":
                //dispatch a doAction event to add a marker to the map
                let event = new CustomEvent("doAction", {detail:
                {
                    guid: this.guid,
                    dispatcher: this,
                    action: mapState,
                    options: {},
                    event: e
                }});
                document.dispatchEvent(event);
                this.stateHandle.setState("OnClick", "NONE");
                this.featuresAdded++;
                break;
            default:
                console.error(`Map ${this.guid} OnClick event fired with unknown state ${currentState}`);
                break;
        }
    }

    clear()
    {
        console.debug(`Clearing ${this.guid} Map`);
        //call the remove function on each feature in the feature array
        console.debug(`FeatureArray ${this.featureArray}`);
        let featureGuids = [];
        for(let i = 1; i < this.featureArray.length; i++)
        {
            if(this.featureArray[i] != null && this.featureArray[i].guid != this.guid)
            {
                featureGuids.push(this.featureArray[i].guid);
            }
        }
        console.debug(`FeatureGuids ${featureGuids}`);
        for(let i = 0; i < featureGuids.length; i++)
        {
            console.debug(`Removing feature ${featureGuids[i]}`);
            let event = new CustomEvent("DeleteMe", {detail: {guid:featureGuids[i]}});
            document.dispatchEvent(event);
        }
        console.debug(`Cleared ${this.guid} Map`);
        this.featuresAdded = 0;
    }
}

export { MapFeature };
export default MapFeature;
