"use strict";
import * as EditorRequirements from "../EditorRequirements.js";
import { GUID, StateHandle } from "../Requirements.js";
//Marker Feature with a property editor
class MarkerFeature extends L.Marker {
    initialStates = 
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
        "OnPreClick":"NONE"
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
        this.options = options;
        this.eventTarget = new EventTarget();
        this.iconType = options.iconType;
        console.debug(`Marker ${this.guid} constructor fired with options: `, options);
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
                    "Title",
                    `${this.options.title}`,
                    ""
                ),
                `${this.options.title}`
            ),
            new EditorRequirements.EditableField(
                `${this.guid}`,
                new EditorRequirements.Field(
                    "string",
                    "description",
                    "Description",
                    `${this.options.description}`,
                    ""
                ),
                `${this.options.description}`
            ),
            new EditorRequirements.EditableField(
				`${this.guid}`,
				new EditorRequirements.Field(
					"number",
					"lat",
					"Latitude",
					`${this.getLatLng().lat}`
				),
				this.getLatLng().lat,
				(value) => {
					return this.getLatLng().lat;
				}
			),
			new EditorRequirements.EditableField(
				`${this.guid}`,
				new EditorRequirements.Field(
					"number",
					"lng",
					"Longitude",
					`${this.getLatLng().lng}`
				),
				this.getLatLng().lng,
				(value) => {
					return this.getLatLng().lng;
				}
			),
            new EditorRequirements.EditableField(
                `${this.guid}`,
                new EditorRequirements.Field(
                    "dropdown",
                    "icon",
                    "Icon",
                    `${this.iconType}`,
                    '',
                    Object.keys(MarkerFeature.icons)
                ),
                this.iconType,
                (value) => {
                    //return the key of icon in icons for where the iconurl matches the given value iconurl
                    console.debug(`Icon value in property editor set to: ${value}`);
                    return value;
                }
           ),
        ];
        this.propertyEditor = new EditorRequirements.FeaturePropertyEditor(
            this,
            this.editableFieldObjects
        );
        this.propertyEditor.open(); //open the property editor
        //create the state handle for the marker
        this.stateHandle = new StateHandle(this.initialStates);
        //listen for a marker state change event and change the state
        //this allows for all the marker states to be changed at the same time when dispatched
        //to the document. dispatches an event to itself to ensure that the event doesn't get acted on 2 times
        document.addEventListener("markerStateChange", (e) => {
            let event = new CustomEvent("markerStateChange", {detail:e});
            this.eventTarget.dispatchEvent(event); 
        }, true);  //prevent the event from bubbling up
        //allows for each marker to be able to change states individually
        this.eventTarget.addEventListener("markerStateChange", (e) => {
            console.debug(`Marker ${this.guid} state change event: ${e.detail.action} ${e.detail.state}`);
            this.stateHandle.setState(e.detail.action, e.detail.state); 
        }, true); //prevent the event from bubbling up
        //create the events for the marker
        this.addEventListener("click", (e) => { this.OnClick(); }, true); //prevent the event from bubbling up
        this.addEventListener("add", (e) => {this.OnAdd();}, true); //prevent the event from bubbling up
        this.marker = this; //reference to the marker object (Self due to extending L.Marker)
    }
    //resets the named state in the state handle to the default state
    resetState(name)
    {
        console.debug(`Resetting ${this.guid} Marker state ${name} back to default state from ${this.stateHandle.getState(name)}`);
        this.stateHandle.resetState(name);
    }

    //Function to update a property of the marker in both the mapo and the property editor
    updateProperty(property, value)
    {
        console.debug(`Marker ${this.guid} updateProperty event fired with property ${property} and value ${value}`);
        if(!(property in this.options))//check if the property exists
        {
            //warn of a non-easy exportable property
            console.warn(`Marker ${this.guid} updateProperty event fired with property ${property} that may require custom importing and exporting to be used.`);
            //throw(`Property ${property} does not exist in Marker`);
        }
        //switch for actions based on the type of property's value
		//this is used to update the marker's objects property on the map
		switch(property)
        {
            case "latlng":
                this.setLatLng(value);
                break;
            case "lat":
                this.setLatLng([value, this.getLatLng().lng]);
            break;
            case "lng":
                this.setLatLng([this.getLatLng().lat, value]);
                break;
            case "icon":
                this.setIcon(MarkerFeature.icons[value]);
                this.options['iconType'] = value;
                break;
            default:
                this.options[property] = value;
                break;
        }
        //update the property editor information
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
                this.remove(); //remove the marker from the map
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

    //function to remove the marker from the map
    remove()
    {
        //close the property editor
        this.propertyEditor.close();
        // Create a deleteme event to tell the editor to delete the marker
        let event = new CustomEvent("DeleteMe", {detail:{"guid":this.guid}});
        document.dispatchEvent(event);
    }

}
export { MarkerFeature };
export default MarkerFeature;
