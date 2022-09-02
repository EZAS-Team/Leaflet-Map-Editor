"use strict";
import * as EditorRequirements from "../EditorRequirements.js";
import { GUID } from "../Requirements.js";
import { StateHandle } from "../Requirements.js";
import {
    MarkerFeature,
    PolylineFeature,
    PolygonFeature,
    CircleFeature,
    RectangleFeature,
} from "../Requirements.js";

//Map class
class MapFeature extends L.Map {
    static initialStates = {
            OnClick: "NONE",
            OnDoubleClick: "NONE",
            OnMouseMove: "NONE",
            OnMouseDown: "NONE",
            OnMouseUp: "NONE",
            OnMouseOver: "NONE",
            OnMouseOut: "NONE",
            OnContextMenu: "NONE",
            OnDrag: "NONE",
            OnDragEnd: "NONE",
            OnDragStart: "NONE",
            OnZoom: "NONE",
            OnZoomEnd: "NONE",
            OnZoomStart: "NONE",
            OnViewReset: "NONE",
            OnMoveEnd: "NONE",
            OnMoveStart: "NONE",
            OnMove: "NONE",
            OnAdd: "NONE",
            OnRemove: "NONE",
            OnPopupOpen: "NONE",
            OnPopupClose: "NONE",
            OnPreclick: "NONE",
        };
    constructor(id, options) {
        super(id, options);
        this.guid = new GUID();
        this.eventTarget = new EventTarget();
        this.MapStateHandle = new StateHandle(MapFeature.initialStates);
        //listen for a map state change event set to the and change the state of all the map states
        document.addEventListener("mapStateChange", (e) => {
            let event = new customEvent("mapStateChange", {detail:e});
            this.eventTarget.dispatchEvent(event);
        });
        //allows for each map to be able to change states individually
        this.eventTarget.addEventListener("mapStateChange", (e) => { this.MapStateHandle.setState(e.detail.action, e.detail.state); });
        this.addEventListener("click", (e) => {
            this.MapOnClick(e);
        });
        

        // this.on("dblclick", (e) => {
        //     MapOnDoubleClick(e);
        // });
        // this.on("mousemove", (e) => {
        //     MapOnMouseMove(e);
        // });
        // this.on("mousedown", (e) => {
        //     MapOnMouseDown(e);
        // });
        // this.on("mouseup", (e) => {
        //     MapOnMouseUp(e);
        // });
        // this.on("mouseover", (e) => {
        //     MapOnMouseOver(e);
        // });
        // this.on("mouseout", (e) => {
        //     MapOnMouseOut(e);
        // });
        // this.on("contextmenu", (e) => {
        //     MapOnContextMenu(e);
        // });
        // this.on("drag", (e) => {
        //     MapOnDrag(e);
        // });
        // this.on("dragend", (e) => {
        //     MapOnDragEnd(e);
        // });
        // this.on("dragstart", (e) => {
        //     MapOnDragStart(e);
        // });
        // this.on("zoom", (e) => {
        //     MapOnZoom(e);
        // });
        // this.on("zoomend", (e) => {
        //     MapOnZoomEnd(e);
        // });
        // this.on("zoomstart", (e) => {
        //     MapOnZoomStart(e);
        // });
        // this.on("viewreset", (e) => {
        //     MapOnViewReset(e);
        // });
        // this.on("moveend", (e) => {
        //     MapOnMoveEnd(e);
        // });
        // this.on("movestart", (e) => {
        //     MapOnMoveStart(e);
        // });
        // this.on("move", (e) => {
        //     MapOnMove(e);
        // });
        // this.on("add", (e) => {
        //     MapOnAdd(e);
        // });
        // this.on("remove", (e) => {
        //     MapOnRemove(e);
        // });
        // this.on("popupopen", (e) => {
        //     MapOnPopupOpen(e);
        // });
        // this.on("popupclose", (e) => {
        //     MapOnPopupClose(e);
        // });
        // this.on("preclick", (e) => {
        //     MapOnPreclick(e);
        // });
        this.self = this;
    }

    MapOnClick(e) {
        switch (this.MapStateHandle.getState("OnClick")) {
            case "NONE":
                break;
            case "ADD_MARKER":
                //dispatch a doAction event to add a marker to the map
                let event = new CustomEvent("doAction", {detail:
                {
                    guid: this.guid,
                    dispatcher: this,
                    action: "ADD_MARKER",
                    event: e
                }});
                document.dispatchEvent(event);
                this.MapStateHandle.setState("OnClick", "NONE");
                break;
            default:
                break;
        }
    }
}

export { MapFeature };
export default MapFeature;
