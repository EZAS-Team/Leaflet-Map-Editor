# Marker

### Marker Object

```
Marker: {
    LatLng: [
        50, //latitude
        30, //longitude
    ],
    options: {
        icon: undefined,
        keyboard: true,
        title: "",
        alt: "Marker",
        zIndexOffset: 0,
        opacity: 1.0,
        riseOnHover: false,
        riseOffset: 250,
        pane: "markerPane",
        shadowPane: "shadowPane",
        bubblingMouseEvents: false,
        autoPanOnFocus: true,
        draggable: false,
        autoPan: false,
        autoPanPadding: L.Point(50, 50),
        autoPanSpeed: 10,
    },
    js: `L.marker(${this.LatLng},${this.Options}).addTo(map);`,
}
```
