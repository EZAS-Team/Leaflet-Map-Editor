"use strict";
import * as EditorRequirements from "../EditorRequirements.js";
import { GUID, StateHandle } from "../Requirements.js";
//Marker Feature with a property editor
class MarkerFeature extends L.Marker {
    static initialStates = 
    {
        "OnClick":"EDIT",
        "OnClick_default":"EDIT",//default state for the OnClick event dont change this during runtime
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
        this.guid = guid.get; //GUID object for the marker
        this.titleField = new EditorRequirements.Field("string","title","Marker Title",`${this.guid}`,"");
        this.propertyEditor = new EditorRequirements.FeaturePropertyEditor(
            this.marker,
            [
                new EditorRequirements.EditableField(
                    `${this.guid}`,
                    this.titleField,
                    ""
                )
            ]
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
        }, true);  //prevent the event from bubbling up
        //allows for each marker to be able to change states individually
        this.eventTarget.addEventListener("markerStateChange", (e) => { 
            this.stateHandle.setState(e.detail.action, e.detail.state); 
        }, true); //prevent the event from bubbling up

        //create the events for the marker
        this.addEventListener("click", (e) => { this.OnClick(); }, true); //prevent the event from bubbling up
        this.addEventListener("add", (e) => {this.OnAdd();}, true); //prevent the event from bubbling up
    }

    //Function to update a property of the marker in both the mapo and the property editor
    updateProperty(property, value)
    {
        console.debug(`Marker ${this.guid} updateProperty event fired with property ${property} and value ${value}`);
        if(!(property in this.options))//check if the property exists
        {
            throw(`Property ${property} does not exist in Marker`);
        }
        this.options[property] = value; //update the property value of the marker
        this.propertyEditor.setEditableFieldValue(property, value); //update the property value in the property editor
    }

    //Callback function for when a marker is clicked on called internally by the marker
    OnClick()
    {
        console.debug(`Marker ${this.guid} OnClick event fired with marker has a state of ${this.stateHandle.getState("OnClick")}`);
        switch (this.stateHandle.getState("OnClick")) 
        {
            case "NONE":
                break;
            case "EDIT":
                this.propertyEditor.open(); //open the property editor
                break;
            case "DELETE":
                // Create a deleteme event to tell the editor to delete the marker
                let event = new CustomEvent("DeleteMe", {detail:{"guid":this.guid}});
                document.dispatchEvent(event);
                break;
            default:
                console.debug("Invalid State For Marker OnClick Event", this.stateHandle.getState("OnClick"));
                break;
        }
    }
    //Callback function for when a marker is added to the map called internally by the marker
    OnAdd()
    {
        console.debug(`Marker ${this.guid} OnAdd event fired with marker has a state of ${this.stateHandle.getState("OnAdd")}`);
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
