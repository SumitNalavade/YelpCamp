const parsedCampground = JSON.parse(campground);

mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        center: parsedCampground.geometry.coordinates, // starting position [lng, lat]
        zoom: 10 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(parsedCampground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${parsedCampground.title}</h3><p>${parsedCampground.location}</p>`
    )
)
.addTo(map)