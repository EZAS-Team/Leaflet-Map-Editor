"use strict";
import * as EditorRequirements from "../EditorRequirements.js";
import { GUID, StateHandle } from "../Requirements.js";
//Marker Feature with a property editor
class MarkerFeature extends L.Marker {
    static initialStates = 
    {
        "OnClick":"NONE",
        "OnAdd":"NONE",
        "OnRemove":"NONE",
        "OnDrag":"NONE",
        "OnDragStart":"NONE",
        "OnDragEnd":"NONE",
        "OnMove":"NONE",
        "OnMoveStart":"NONE",
        "OnMoveEnd":"NONE",
        "OnPopupOpen":"NONE",
        "OnPopupClose":"NONE",
        "OnTooltipOpen":"NONE",
        "OnTooltipClose":"NONE",
        "OnMouseDown":"NONE",
        "OnMouseUp":"NONE",
        "OnMouseOver":"NONE",
        "OnMouseOut":"NONE",
        "OnContextMenu":"NONE",
        "OnPreClick":"NONE",
    };
    constructor(latlng, options, guid = new GUID()) {
        super(latlng, options);
        this.eventTarget = new EventTarget();
        this.marker = this; //reference to the marker object (Self due to extending L.Marker)
        this.guid = guid; //GUID object for the marker
        this.propertyEditor = new EditorRequirements.FeaturePropertyEditor(
            this.marker,
            [new EditorRequirements.EditableField("Marker Name", "string")]
        );
        this.propertyEditor.open();
        //create the state handle for the marker
        this.stateHandle = new StateHandle(MarkerFeature.initialStates);
        //listen for a marker state change event and change the state
        //this allows for all the marker states to be changed at the same time when dispatched
        //to the document. dispatches an event to itself to ensure that the event doesn't get acted on 2 times
        document.addEventListener("markerStateChange", (e) => {
            let event = new customEvent("markerStateChange", {detail:e});
            this.eventTarget.dispatchEvent(event); 
        });
        //allows for each marker to be able to change states individually
        this.eventTarget.addEventListener("markerStateChange", (e) => { this.stateHandle.setState(e.detail.action, e.detail.state); });
        //create the events for the marker
        this.eventTarget.addEventListener("click", (e) => { this.OnClick(); });
        this.eventTarget.addEventListener("add", (e) => {this.OnAdd();})

    }

    //Callback function for when a marker is clicked on called internally by the marker
    OnClick()
    {
        switch (this.stateHandle.getState("OnClick")) 
        {
            case "NONE":
                break;
            case "EDIT":
                this.propertyEditor.open();
                break;
            case "DELETE":
                let event = new CustomEvent("DeleteMe", {detail:{"guid":this.guid}});
                document.dispatchEvent(event);
                break;
            default:
                break;
        }
    }
    //Callback function for when a marker is added to the map called internally by the marker
    OnAdd()
    {
        switch (this.stateHandle.getState("OnAdd")) {
            case "NONE":
                break;
            default:
                break;
        }
    }
}
export { MarkerFeature };
export default MarkerFeature;
