"use strict";
//Class to interact with a map object
class PsuedoMapInteract
{
    constructor()
    {
        //get the map object from the editor
        this.eventTarget = new EventTarget();
        this.updateMapObject(); //get the map object from the editor
        document.addEventListener("returnMap",(e)=>{this.retriveMapObject(e);}, true);
        this.validActions =
        [
            "ADD_MARKER",
            "ADD_CIRCLE",
            // "ADD_POLYLINE",
            // "ADD_POLYGON",
            // "ADD_RECTANGLE"
        ];
    }

    //internal function not to be called by user
    retriveMapObject(event)
    {
        this._map = event.detail.map_object; //set the map object
    }

    //internal function not to be called by user
    updateMapObject()
    {
        //get the map object from the editor using the event
        let event = new CustomEvent("getMap", {});
        document.dispatchEvent(event);
    }

    //called with a lat and lng, a options object, and a action string
    psuedoMapClick(latlng, options, action) {
        //check if the action is in the valid actions array
        if (!(this.validActions.includes(action)))
        { 
            throw new Error("Invalid action: " + action);
        }
        this.updateMapObject(); //update the map object
        let event = new CustomEvent("doAction", {detail:
        {
            guid: this._map.guid, //map guid
            dispatcher: this._map, //map object
            action: action, //action to perform
            options: options,//options to pass to the action
            event: {latlng: latlng} //psuedo click event
        }});
        document.dispatchEvent(event);
    }
}

//not implemented nor planned to be implemented at this time
class PsuedoMarkerInteract
{}

//not implemented nor planned to be implemented at this time
class PsuedoCircleInteract
{}

//not implemented nor planned to be implemented at this time
class PsuedoPolylineInteract
{}

//not implemented nor planned to be implemented at this time
class PsuedoPolygonInteract
{}

//not implemented nor planned to be implemented at this time
class PsuedoRectangleInteract
{}

export {PsuedoMapInteract, PsuedoMarkerInteract, PsuedoCircleInteract, PsuedoPolylineInteract, PsuedoPolygonInteract, PsuedoRectangleInteract}; 

