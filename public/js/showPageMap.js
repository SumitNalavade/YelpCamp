const parsedCampgroundGeometry = JSON.parse(campgroundGeometry);
const parsedCampgroundTitle = JSON.parse(campgroundTitle);
const parsedCampgroundLocation = JSON.parse(campgroundLocation);

mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: parsedCampgroundGeometry.coordinates, // starting position [lng, lat]
        zoom: 10 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(parsedCampgroundGeometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${parsedCampgroundTitle}</h3><p>${parsedCampgroundLocation}</p>`
    )
)
.addTo(map)