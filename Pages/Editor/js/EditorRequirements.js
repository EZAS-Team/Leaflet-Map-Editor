"use strict";
const editableFieldOptions = {
    string: {
        type: "string",
        label: (label = "Text") => {
            return label;
        },
        placeholder: (placeholder = "Enter text here") => {
            return placeholder;
        },
        default: (defaultValue = "") => {
            return defaultValue;
        },
    },
    number: {
        type: "number",
        label: (label = "Number") => {
            return label;
        },
        placeholder: (placeholder = "Enter a number here") => {
            return placeholder;
        },
        default: (defaultValue = 0) => {
            return defaultValue;
        },
    },
    dropdown: {
        type: "dropdown",
        label: (label = "Dropdown") => {
            return label;
        },
        placeholder: (placeholder = "Select an option") => {
            return placeholder;
        },
    },
};

class EditableField {
    constructor(
        name = "",
        type = "string",
        options = editableFieldOptions[type],
        value = options.default
    ) {
        if (typeof name !== "string" || name.length === 0) {
            throw new Error("name must be a non-empty string");
        }
        if (
            typeof type !== "string" ||
            type.length === 0 ||
            !(type in editableFieldOptions)
        ) {
            throw new Error("type must be a non-empty string");
        }
        this.name = name;
        this.type = type;
        this.options = options;
        this.value = value;
    }

    get() {
        return this.value;
    }

    set(value) {
        this.value = value;
    }

    toString() {
        return this.name + ": " + this.value;
    }

    toJSON() {
        return {
            name: this.name,
            type: this.type,
            options: this.options,
            value: this.value,
        };
    }
}

class PropertyEditor {
    constructor() {
        this.openEvent = new CustomEvent("openPropertyEditor", {
            detail: super.feature,
        });
        this.updateEvent = new CustomEvent("updatePropertyEditor", {
            detail: super.feature,
        });
        this.saveChangesEvent = new CustomEvent("saveChangesPropertyEditor", {
            detail: super.feature,
        });
        this.editableFields = [];
    }
    addEditableField(editableField) {
        if (typeof editableField !== "object" || editableField === null) {
            throw new Error("editableField must be an EditableField object");
        }
        //add the editableField to the array
        this.editableFields.push(editableField);
    }

    removeEditableField(editableField) {
        if (typeof editableField !== "object" || editableField === null) {
            throw new Error("editableField must be an EditableField object");
        }
        let editableFieldsLength = editableFields.length;
        for (let i = 0; i < editableFieldsLength; i++) {
            let currentEditableField = editableFields[i];
            if (currentEditableField.name === editableField.name) {
                //remove the editableField from the array
                editableFields.splice(i, 1);
            }
        }
    }

    getEditableFields() {
        return editableFields;
    }
}

class FeaturePropertyEditor extends PropertyEditor {
    constructor(feature, editableFields = []) {
        super();
        this.feature = feature;
        this.propertyEditor = new PropertyEditor();
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
            this.propertyEditor.addEditableField(currentEditableField);
        }
    }

    open() {
        document.dispatchEvent(this.propertyEditor.openEvent, this.feature);
    }

    update() {
        document.dispatchEvent(this.propertyEditor.updateEvent, this.feature);
    }

    saveChanges() {
        document.dispatchEvent(
            this.propertyEditor.saveChangesEvent,
            this.feature
        );
    }
}

export { EditableField, PropertyEditor, FeaturePropertyEditor };
