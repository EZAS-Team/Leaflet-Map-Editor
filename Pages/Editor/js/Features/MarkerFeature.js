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
        "OnAdd_default":"OPEN",//default state for the OnAdd event dont change this during runtime
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
        "IconType":"DEFAULT-BLUE",
        "IconType_default":"DEFAULT-BLUE",
    };

    static icons =
    {
        "DEFAULT-BLUE": L.icon({
            iconUrl: '../../../Resources/Features/Marker/Icons/default-blue.png',
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize:  [41, 41]
        }),
        "DEFAULT-RED": L.icon({
            iconUrl: '../../../Resources/Features/Marker/Icons/default-red.png',
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize:  [41, 41]
        }),
        "DEFAULT-GREEN": L.icon({
            iconUrl: '../../../Resources/Features/Marker/Icons/default-green.png',
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize:  [41, 41]
        }),
        "DEFAULT-PURPLE": L.icon({
            iconUrl: '../../../Resources/Features/Marker/Icons/default-purple.png',
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize:  [41, 41]
        }),
        "DEFAULT-YELLOW": L.icon({
            iconUrl: '../../../Resources/Features/Marker/Icons/default-yellow.png',
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize:  [41, 41]
        }),
    };

    constructor(latlng, options, guid = new GUID()) {
        super(latlng, options);
        this.eventTarget = new EventTarget();
        this.marker = this; //reference to the marker object (Self due to extending L.Marker)
        this.guid = guid.get; //GUID object for the marker
        //create the fields that can be edited in the property editor for the marker
        //cant be static because guid is required and unique for each marker
        this.editableFieldObjects =
        [
            new EditorRequirements.EditableField(
                `${this.guid}`,
                new EditorRequirements.Field(
                    "string",
                    "title",
                    "Marker Title",
                    `${this.guid}`,
                    ""
                ),
                ""
            ),
            new EditorRequirements.EditableField(
                `${this.guid}`,
                new EditorRequirements.Field(
                    "string",
                    "description",
                    "Marker Description",
                    `${this.guid}`,
                    ""
                ),
                ""
            ),

            // the marker type dropdown is discluded because it is not editable
            // until a feature is implemented to copy and recreate with the new icon
            // new EditorRequirements.EditableField(
            //     `${this.guid}`,
            //     new EditorRequirements.Field(
            //         "dropdown",
            //         "icon",
            //         "Marker Icon",
            //         `${this.guid}`,
            //         MarkerFeature.icons["default-blue"],
            //         Object.keys(MarkerFeature.icons)
            //     ),
            //     ""
            // ),
        ];
        this.propertyEditor = new EditorRequirements.FeaturePropertyEditor(
            this,
            this.editableFieldObjects
        );
        this.propertyEditor.open(); //open the property editor
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
            //warn of a non-easy exportable property
            console.warn(`Marker ${this.guid} updateProperty event fired with property ${property} that does not exist in standard leaflet.
                It will be added to the marker object but requires custom importing and exporting to be used.
                This is not recommended.`);
            //throw(`Property ${property} does not exist in Marker`);
        }
        //swtich for actions based on the type of property's value
        let propertyValue = this.options[property];
        if(propertyValue instanceof L.Icon)
        {
            return;
            this.options[property] = MarkerFeature.icons[value];
        }
        else if(propertyValue instanceof L.LatLng)
        {
            this.options[property]=this.SetLatLng(value);
        }
        else
        {
            this.options[property] = value; //update the property value of the marker
        }
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
                console.error("Invalid State For Marker OnClick Event", this.stateHandle.getState("OnClick"));
                break;
        }
    }
    //Callback function for when a marker is added to the map called internally by the marker
    OnAdd()
    {
        console.debug(`Marker ${this.guid} OnAdd event fired with marker has a state of ${this.stateHandle.getState("OnAdd")}`);
        switch (this.stateHandle.getState("OnAdd")) {
            case "NONE":
            case "OPEN":
                this.propertyEditor.open(); //open the property editor
                break;
            default:
                console.error(`Marker ${this.guid} OnAdd State is Invalid or Unknown: `, this.stateHandle.getState("OnAdd"));
                break;
        }
    }

}
export { MarkerFeature };
export default MarkerFeature;
