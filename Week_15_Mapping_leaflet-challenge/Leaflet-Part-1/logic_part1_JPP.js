
//Create a JavaScript file (e.g., your_script.js) to initialize the map and plot the earthquakes:
// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the earthquake data (replace 'YOUR_DATA_URL' with the URL of the GeoJSON data)
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
    .then(response => response.json())
    .then(data => {
        // Loop through the earthquake data and create markers
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates;
            var mag = feature.properties.mag;
            var depth = coords[2];

            // Customize marker size and color based on magnitude and depth
            var marker = L.circleMarker([coords[1], coords[0]], {
                radius: mag * 2, // Adjust the multiplier for appropriate marker size
                fillColor: getColor(depth), // Function to get color based on depth
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            // Add popup with earthquake information
            marker.bindPopup(`<b>Magnitude:</b> ${mag}<br><b>Depth:</b> ${depth} km`);
        });
    });

// Function to get color based on depth
function getColor(depth) {
    // Add your logic to determine color based on depth range
    return depth > 100 ? '#ff0000' : '#008000'; // Example: Red for depth > 100 km, Green for depth <= 100 km
}