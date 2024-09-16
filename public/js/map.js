const mapElement = document.getElementById("mapp");
const MapToken = mapElement.getAttribute("data-map-token");

mapboxgl.accessToken = MapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geomatry.coordinates, // starting position [lng, lat]
  zoom: 6, // starting zoom
});

console.log(listing.geomatry.coordinates);
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geomatry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.location}</h4><p>Exact Location Provided After Booking</p>`
    )
  )
  .addTo(map);
