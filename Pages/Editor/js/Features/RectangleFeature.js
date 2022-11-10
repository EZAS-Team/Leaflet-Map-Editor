"use strict";
import * as EditorRequirements from "../EditorRequirements.js";
import { GUID, StateHandle } from "../Requirements.js";

class RectangleFeature extends L.Rectangle {
	static initialStates = {
		OnClick: "EDIT",
		OnClick_default: "EDIT", //default state for the OnClick event dont change this during runtime
		OnAdd: "NONE",
		OnAdd_default: "OPEN", //default state for the OnAdd event dont change this during runtime
		OnRemove: "NONE",
		OnDrag: "NONE",
		OnDragStart: "NONE",
		OnDragEnd: "NONE",
		OnMove: "NONE",
		OnMoveStart: "NONE",
		OnMoveEnd: "NONE",
		OnPopupOpen: "NONE",
		OnPopupClose: "NONE",
		OnTooltipOpen: "NONE",
		OnTooltipClose: "NONE",
		OnMouseDown: "NONE",
		OnMouseUp: "NONE",
		OnMouseOver: "NONE",
		OnMouseOut: "NONE",
		OnContextMenu: "NONE",
		OnPreClick: "NONE",
	};

	constructor(bounds, options, guid = new GUID()) {
		super(bounds, options);
        this.bounds = bounds;
		this.eventTarget = new EventTarget();
		this.rectangle = this; //reference to the rectangle object (Self due to extending L.rectangle)
		this.guid = guid.get; //GUID object for the rectangle
        console.debug(`Rectangle ${this.guid} constructor fired with options: `, options);
        if (options.title == undefined) options.title = "Rectangle";
		if (options.description == undefined) options.description = "";
		//create the fields that can be edited in the property editor for the rectangle
		//cant be static because guid is required and unique for each rectangle
		this.editableFieldObjects = [
			new EditorRequirements.EditableField(
				`${this.guid}`,
				new EditorRequirements.Field(
					"string",
					"title",
					"Title",
                    "Title",
					`${this.options.title}`
				),
				""
			),
			new EditorRequirements.EditableField(
				`${this.guid}`,
				new EditorRequirements.Field(
					"stringBox",
					"description",
					"Description",
                    "Description",
					`${this.options.description}`,
				),
				""
			),
			new EditorRequirements.EditableField(
				`${this.guid}`,
				new EditorRequirements.Field(
					"number",
					"bounds1lat",
					"Bounds 1 Latitude",
					"Bounds 1 Latitude",
					`${this.bounds[0].lat}`,
				),
				this.bounds[0].lat,
			),
            new EditorRequirements.EditableField(
				`${this.guid}`,
				new EditorRequirements.Field(
					"number",
					"bounds1lng",
					"Bounds 1 Longitude",
                    "Bounds 1 Longitude",
					`${this.bounds[0].lng}`,
				),
				this.bounds[0].lng,
			),
            new EditorRequirements.EditableField(
				`${this.guid}`,
				new EditorRequirements.Field(
					"number",
					"bounds2lat",
					"Bounds 2 Latitude",
                    "Bounds 2 Latitude",
					`${this.bounds[1].lat}`,
				),
				this.bounds[1].lat,
			),
            new EditorRequirements.EditableField(
				`${this.guid}`,
				new EditorRequirements.Field(
					"number",
					"bounds2lng",
					"Bounds 2 longitude",
                    "Bounds 2 longitude",
					`${this.bounds[1].lng}`,
				),
				this.bounds[1].lng,
			)
		];
		this.propertyEditor = new EditorRequirements.FeaturePropertyEditor(
			this,
			this.editableFieldObjects
		);
		this.propertyEditor.open(); //open the property editor
		//create the state handle for the rectangle
		this.stateHandle = new StateHandle(RectangleFeature.initialStates);
		//listen for a rectangle state change event and change the state
		//this allows for all the rectangle states to be changed at the same time when dispatched
		//to the document. dispatches an event to itself to ensure that the event doesn't get acted on 2 times

		document.addEventListener(
			"rectangleStateChange",
			(e) => {
				let event = new CustomEvent("rectangleStateChange", { detail: e });
				this.eventTarget.dispatchEvent(event);
			},
			true
		); //prevent the event from bubbling up
		//allows for each rectangle to be able to change states individually
		this.eventTarget.addEventListener(
			"rectangleStateChange",
			(e) => {
                console.debug(`Rectangle ${this.guid} state change event: ${e.detail.action} ${e.detail.state}`);
				this.stateHandle.setState(e.detail.action, e.detail.state);
			},
			true
		); //prevent the event from bubbling up
		//create the events for the rectangle
		this.addEventListener(
			"click",
			(e) => {
				this.OnClick();
			},
			true
		); //prevent the event from bubbling up
		this.addEventListener(
			"add",
			(e) => {
				this.OnAdd();
			},
			true
		); //prevent the event from bubbling up
	}
	//resets the named state in the state handle to the default state
	resetState(name) {
		console.debug(
			`Resetting ${
				this.guid
			} Rectangle state ${name} back to default state from ${this.stateHandle.getState(
				name
			)}`
		);
		this.stateHandle.resetState(name);
	}

	//Function to update a property of the rectangle in both the mapo and the property editor
	updateProperty(property, value) {
		console.debug(
			`Rectangle ${this.guid} updateProperty event fired with property ${property} and value ${value}`
		);
		//swtich for actions based on the type of property's value
		//this is used to update the rectangle's objects property on the map
		if (!(property in this.options)) {
            console.warn(`Rectangle ${this.guid} updateProperty event fired with property ${property} that may require custom importing and exporting to be used.`);
		}
		switch (property) {
			case "latlng":
				this.setLatLng(value);
				break;
			case "lat":
				this.setLatLng([value, this.getLatLng().lng]);
				break;
			case "lng":
				this.setLatLng([this.getLatLng().lat, value]);
				break;
			case "bounds":
				this.setBounds(value);
                this.bounds = value;
				break;
            case "bounds1lat":
                this.setBounds([[value, this.bounds[0].lng], this.bounds[1]]);
                this.bounds[0].lat = value;
                break;
            case "bounds1lng":
                this.setBounds([[this.bounds[0].lat, value], this.bounds[1]]);
                this.bounds[0].lng = value;
                break;
            case "bounds2lat":
                this.setBounds([this.bounds[0], [value, this.bounds[1].lng]]);
                this.bounds[1].lat = value;
                break;
            case "bounds2lng":
                this.setBounds([this.bounds[0], [this.bounds[1].lat, value]]);
                this.bounds[1].lng = value;
                break;
            case "description":
				this.options.description = value;
                break;
			default:
				this.options[property] = value;
				break;
		}
		//update the property editor information
		this.propertyEditor.setEditableFieldValue(property, value); //update the property value in the property editor
	}

	//Callback function for when a rectangle is clicked on called internally by the rectangle
	OnClick() {
		console.debug(
			`Rectangle ${
				this.guid
			} OnClick event fired with a state of ${this.stateHandle.getState(
				"OnClick"
			)}`
		);
		switch (this.stateHandle.getState("OnClick")) {
			case "NONE":
				break;
			case "EDIT":
				this.propertyEditor.open(); //open the property editor
				break;
			case "DELETE":
				//close the property editor
				this.propertyEditor.close();
				// Create a deleteme event to tell the editor to delete the rectangle
				let event = new CustomEvent("DeleteMe", {
					detail: { guid: this.guid },
				});
				document.dispatchEvent(event);
				break;
			default:
				console.error(
					"Invalid State for Rectangle OnClick Event",
					this.stateHandle.getState("OnClick")
				);
				break;
		}
	}
	//Callback function for when a rectangle is added to the map called internally by the rectangle
	OnAdd() {
		console.debug(
			`Rectangle ${
				this.guid
			} OnAdd event fired with a state of ${this.stateHandle.getState(
				"OnAdd"
			)}`
		);
		switch (this.stateHandle.getState("OnAdd")) {
			case "NONE":
			case "OPEN":
				this.propertyEditor.open(); //open the property editor
				break;
			default:
				console.error(
					`Rectangle ${this.guid} OnAdd State is Invalid or Unknown: `,
					this.stateHandle.getState("OnAdd")
				);
				break;
		}
	}
}

export { RectangleFeature };
export default RectangleFeature;
