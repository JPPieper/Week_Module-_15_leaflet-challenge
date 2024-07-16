// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the earthquake data using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(function(data) {
        // Loop through the earthquake data and create markers
        data.features.forEach(function(feature) {
            var coords = feature.geometry.coordinates;
            var mag = feature.properties.mag;
            var depth = coords[2];

            // Customize marker size and color based on magnitude and depth
            var marker = L.circleMarker([coords[1], coords[0]], {
                radius: mag * 2, // Adjust the multiplier for appropriate marker size
                fillColor: getColor(depth), // Function to get color based on depth
                color: '#000',
                weight: 1,
                opacity: .5,
                fillOpacity: 0.4
            }).addTo(map);

            // Add popup with earthquake information
            marker.bindPopup(`<b>Magnitude:</b> ${mag}<br><b>Depth:</b> ${depth} km`);
        });

        // Add a legend
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += '<h4>Depth Legend</h4>';
               // Add color indicators to the legend
             div.innerHTML += '<br><div><span style="background-color: #ff0000; width: 20px; height: 10px; display: inline-block;"></span> Depth > 300 km</div>';
             div.innerHTML += '<div><span style="background-color: #ff6600; width: 20px; height: 10px; display: inline-block;"></span> 200 km < Depth <= 300 km</div>';
             div.innerHTML += '<div><span style="background-color: #ffcc00; width: 20px; height: 10px; display: inline-block;"></span> 100 km < Depth <= 200 km</div>';
             div.innerHTML += '<div><span style="background-color: #008000; width: 20px; height: 10px; display: inline-block;"></span> Depth <= 100 km</div>';

                return div;
        };

        legend.addTo(map);
    });

// Function to get color based on depth
function getColor(depth) {
    if (depth > 300) {
        return '#ff0000'; // Red for Depth > 300 km
    } else if (depth > 200) {
        return '#ff6600'; // Orange for 200 km < Depth <= 300 km
    } else if (depth > 100) {
        return '#ffcc00'; // Yellow for 100 km < Depth <= 200 km
    } else {
        return '#008000'; // Green for Depth <= 100 km
    }
}