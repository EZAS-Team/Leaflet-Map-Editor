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

//Map states
class MapState extends StateHandle {
    //Map states
    constructor() {
        let initialStates = {
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
        super(initialStates);
    }
}

//Map class
class MapFeature extends L.Map {
    constructor(id, options) {
        super(id, options);
        this.guid = new GUID();
        this.MapStateHandle = new MapState();
        this.on("click", (e) => {
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
                let marker = new MarkerFeature(e.latlng);
                marker.addTo(this.self);
                break;
            default:
                break;
        }
    }
}

export { MapFeature };
export default MapFeature;
