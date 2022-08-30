import * as EZAS from "./Requirements";
function generateGUID() {
    // generate a guid and return it
    let guid = "";
    for (let i = 0; i < 32; i++) {
        guid += Math.floor(Math.random() * 0xf).toString(0xf);
    }
    return guid;
}

//Create a new GUID object. If an id is passed in, use that, otherwise generate a new one.
class GUID {
    constructor(id = generateGUID()) {
        this.id = id;
    }

    get() {
        return this.id;
    }
}

//extends the leaflet class to add a guid property to leaflet objects
class Feature {
    constructor(id = new GUID()) {
        if (typeof id !== "object") {
            throw new Error("id must be an GUID object");
        }
        this.id = id;
    }
    getGUID() {
        return this.id;
    }
    get guid() {
        return this.id;
    }
}

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

//Map class
class MapFeature extends L.Map {
    constructor(id, options) {
        super(id, options);
        this.guid = new GUID();
        
    }
}

//Marker Feature with a property editor
class MarkerFeature extends L.Marker {
    constructor(latlng, options, guid = new GUID()) {
        super(latlng, options);
        this.marker = this; //reference to the marker object (Self due to extending L.Marker)
        this.guid = guid; //GUID object for the marker
        this.propertyEditor = new FeaturePropertyEditor(this.marker, [
            new EditableField("Marker Name", "string"),
        ]);
        this.propertyEditor.open();
    }
}

let map = new MapFeature("map", {});
map.setView([51.505, -0.09], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
let marker;
try {
    marker = new MarkerFeature([51.5, -0.09], {});
    marker.
    marker.addTo(map);
    marker.on("click", function (e) {
        this.propertyEditor.open();
    });
    marker.on("update", function (e) {
        this.propertyEditor.update();
    });
    marker.on("saveChanges", function (e) {
        this.propertyEditor.saveChanges();
    });
} catch (error) {
    console.log(error);
}

window.addEventListener("finishedImport", (e) => { initization(e.detail); });

let gmap = new MapFeature("map", {});

function initialize(map)
{
    gmap = map;
}