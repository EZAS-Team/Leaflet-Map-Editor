"use strict";

class Field {
	constructor(type, propertyName, label, placeholder, defaultValue, options = undefined) {
		this._type = type;
        this._propertyName = propertyName;
		this._label = label;
		this._placeholder = placeholder;
		this._defaultValue = defaultValue;
		this._options = options;
	}
	get type() {
		return this._type;
	}
    get propertyName() {
        return this._propertyName;
    }

	get label() {
		if (arguments.length !== 0) {
			this._label = arguments[0];
		}
		return this._label;
	}
	get placeholder() {
		if (arguments.length !== 0) {
			this._placeholder = arguments[0];
		}
		return this._placeholder;
	}
	get defaultValue() {
		if (arguments.length !== 0) {
			this._defaultValue = arguments[0];
		}
		return this._defaultValue;
	}
	get options() {
		if (this._options === undefined) {
			throw new Error("Field does not have options");
		}
		if (arguments.length !== 0) {
			this._options = arguments[0];
		}
		return this._options;
	}
}

//some examples of how to use the Field class that is passed into the EditableField class
const editableFieldOptions = {
	string: new Field("string","Title", "Text Field", "Enter Text", ""),
	number: new Field("number", "Count","Number Field", "Enter Number", 0),
	dropdown: new Field("dropdown","Color", "Dropdown Field", "Select an Option", "", [
		"Option 1",
		"Option 2",
		"Option 3",
	]),
};

class EditableField {
	constructor(guid = "", field = editableFieldOptions[0], value = undefined) {
		if (typeof guid !== "string" || guid.length === 0) {
			throw new Error("name must be a non-empty string");
		}
		this.guid = guid;
		this.field = field;
		if (value === undefined) {
			this.value = field.defaultValue;
		} else {
			this.value = value;
		}
	}

	get propertyName()
	{
		return this.field.propertyName;
	}

	get() {
		return this.value;
	}

	set(value) {
		this.value = value;
	}

	toString() {
		return `${this.guid}-${this.field.propertyName}:${this.value}`;
	}

	toJSON() {
		return {
			guid: this.guid,
			field: this.field,
			value: this.value,
		};
	}

	//returns the html for the editable field
	toHTML() {
		let html = `
        <div id="${this.field.propertyName}_div" class="editable-field-${this.field.type}">
            <label id="${this.field.propertyName}_label" for="${this.field.propertyName}">${this.field.label}</label>
            <input 
				id="${this.field.propertyName}_input"
                type="${this.field.type}" 
                name="${this.field.propertyName}" 
                placeholder="${this.field.placeholder}" 
                value="${this.value}"
                onchange="updateFeatureProperty('${this.guid}',
				'${this.field.propertyName}',
				document.getElementById('${this.field.propertyName}_input').value)"
				)"
            />
        </div>`;
		return html;
	}
}

class PropertyEditor {
	constructor(feature) {
		if (typeof feature !== "object" || feature === null) {
			throw new Error("feature must be an object");
		}
		this.openEvent = new CustomEvent("openPropertyEditor", {
			detail: feature,
		});
		this.feature = feature;
		this.editableFields = [];
	}
	addEditableField(editableField) {
		if (typeof editableField !== "object" || editableField === null) {
			throw new Error("editableField must be an EditableField object");
		}
		//add the editableField to the array
		this.editableFields.push(editableField);
	}

	//removes the first editable field with the propertyname from the array and returns it
	//if the editable field is not found, returns undefined
	removeEditableField(propertyName) {
		if (typeof propertyName !== "string" || editableField === "") {
			throw new Error("propertyName must be a non-empty string");
		}
		let editableFieldsLength = this.editableFields.length;
		for (let i = 0; i < editableFieldsLength; i++) {
			let currentEditableField = this.editableFields[i];
			if (currentEditableField.propertyName === propertyName) {
				//remove the editableField from the array
				return this.editableFields.splice(i, 1);
			}
		}
		return undefined;
	}

	//sets the value of the editable field with the given propertyName
	setEditableFieldValue(propertyName, value)
	{
		//throw an error if the field name is not a string or is empty
		if(typeof propertyName !== "string" || propertyName.length === 0)
		{
			throw new Error("propertyName must be a non-empty string");
		}

		//find the editable field with the given name
		let editableFieldsLength = this.editableFields.length;
		for (let i = 0; i < editableFieldsLength; i++) {
			let currentEditableField = this.editableFields[i];
			if (currentEditableField.propertyName === propertyName) {
				//set the value of the editable field
				this.editableFields[i].set(value);
			}
		}
	}

	getEditableFields() {
		return this.editableFields;
	}

	toHTML() {
		let html = "";
		let editableFieldsLength = this.editableFields.length;
		for (let i = 0; i < editableFieldsLength; i++) {
			let currentEditableField = this.editableFields[i];
			html += currentEditableField.toHTML();
		}
		return html;
	}
}

class FeaturePropertyEditor extends PropertyEditor {
	constructor(feature = undefined, editableFields = []) {
		super(feature);
		this.feature = feature;
		this.createFeaturePropertyEditor(editableFields);
	}

	createFeaturePropertyEditor(editableFields) {
		//throw an error if the editableFields array is not an array of EditableField objects
		if (typeof editableFields !== "object" || editableFields === null) {
			throw new Error(
				"editableFields must be an array of EditableField objects"
			);
		}
		let editableFieldsLength = editableFields.length;
		for (let i = 0; i < editableFieldsLength; i++) {
			let currentEditableField = editableFields[i];
			if (
				typeof currentEditableField !== "object" ||
				currentEditableField === null
			) {
				throw new Error(
					"editableFields must be an array of EditableField objects"
				);
			}
			this.addEditableField(currentEditableField);
		}
	}

	open() {
		document.dispatchEvent(this.openEvent);
	}
}

export { EditableField, PropertyEditor, FeaturePropertyEditor, Field };
