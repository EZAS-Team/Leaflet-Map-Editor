"use strict";
import * as EditorRequirements from "../EditorRequirements.js";
import { GUID, StateHandle } from "../Requirements.js";

class CircleFeature extends L.Circle {
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

	constructor(latlng, options, guid = new GUID()) {
		super(latlng, options);
		this.eventTarget = new EventTarget();
		this.circle = this; //reference to the circle object (Self due to extending L.circle)
		this.guid = guid.get; //GUID object for the circle
		//create the fields that can be edited in the property editor for the circle
		//cant be static because guid is required and unique for each circle
		this.editableFieldObjects = [
			new EditorRequirements.EditableField(
				`${this.guid}`,
				new EditorRequirements.Field(
					"string",
					"title",
					"Title",
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
					"Description",
					`${this.guid}`,
					""
				),
				""
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
					"number",
					"radius",
					"Radius",
					`${this.guid}`,
					100
				),
				this.options.radius
			)
		];
		this.propertyEditor = new EditorRequirements.FeaturePropertyEditor(
			this,
			this.editableFieldObjects
		);
		this.propertyEditor.open(); //open the property editor
		//create the state handle for the circle
		this.stateHandle = new StateHandle(CircleFeature.initialStates);
		//listen for a circle state change event and change the state
		//this allows for all the circle states to be changed at the same time when dispatched
		//to the document. dispatches an event to itself to ensure that the event doesn't get acted on 2 times

		document.addEventListener(
			"circleStateChange",
			(e) => {
				let event = new CustomEvent("circleStateChange", { detail: e });
				this.eventTarget.dispatchEvent(event);
			},
			true
		); //prevent the event from bubbling up
		//allows for each circle to be able to change states individually
		this.eventTarget.addEventListener(
			"circleStateChange",
			(e) => {
				this.stateHandle.setState(e.detail.action, e.detail.state);
			},
			true
		); //prevent the event from bubbling up
		//create the events for the circle
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
			} Circle state ${name} to back to default state from ${this.stateHandle.getState(
				name
			)}`
		);
		this.stateHandle.resetState(name);
	}

	//Function to update a property of the circle in both the mapo and the property editor
	updateProperty(property, value) {
		console.debug(
			`Circle ${this.guid} updateProperty event fired with property ${property} and value ${value}`
		);
		//swtich for actions based on the type of property's value
		//this is used to update the circle's objects property on the map
		if (!(property in this.options)) {
            console.warn(`Circle ${this.guid} updateProperty event fired with property ${property} that may require custom importing and exporting to be used.`);
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
			case "radius":
				this.setRadius(value);
				break;
			default:
				this.options[property] = value;
				break;
		}
		//update the property editor information
		this.propertyEditor.setEditableFieldValue(property, value); //update the property value in the property editor
	}

	//Callback function for when a circle is clicked on called internally by the circle
	OnClick() {
		console.debug(
			`Circle ${
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
				// Create a deleteme event to tell the editor to delete the circle
				let event = new CustomEvent("DeleteMe", {
					detail: { guid: this.guid },
				});
				document.dispatchEvent(event);
				break;
			default:
				console.error(
					"Invalid State for Circle OnClick Event",
					this.stateHandle.getState("OnClick")
				);
				break;
		}
	}
	//Callback function for when a circle is added to the map called internally by the circle
	OnAdd() {
		console.debug(
			`Circle ${
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
					`Circle ${this.guid} OnAdd State is Invalid or Unknown: `,
					this.stateHandle.getState("OnAdd")
				);
				break;
		}
	}
}

export { CircleFeature };
export default CircleFeature;
