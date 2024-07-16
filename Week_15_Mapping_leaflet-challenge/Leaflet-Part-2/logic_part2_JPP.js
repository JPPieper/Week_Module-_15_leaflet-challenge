// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add base layers from different tile providers
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors'
});

// Fetch the tectonic plates data using D3
d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
    .then(function(tectonicData) {
        var tectonicPlates = L.geoJSON(tectonicData, {
            style: function(feature) {
                return { color: 'grey', weight: 2 }; // Customize tectonic plate style
            }
        });

        // Fetch the earthquake data using D3
        d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
            .then(function(data) {
                var earthquakes = L.layerGroup(); // Create a layer group for earthquakes

                // Loop through the earthquake data and create markers
                data.features.forEach(function(feature) {
                    var coords = feature.geometry.coordinates;
                    var mag = feature.properties.mag;
                    var depth = coords[2];

                    // Customize marker size and color based on magnitude and depth
                    var marker = L.circleMarker([coords[1], coords[0]], {
                        radius: mag * 1
                        , // Adjust the multiplier for appropriate marker size
                        fillColor: getColor(depth), // Function to get color based on depth
                        color: '#000',
                        weight: 1,
                        opacity: .5,
                        fillOpacity: 0.4
                    });

                    // Add popup with earthquake information
                    marker.bindPopup(`<b>Magnitude:</b> ${mag}<br><b>Depth:</b> ${depth} km`);

                    earthquakes.addLayer(marker); // Add marker to the earthquakes layer group
                });

                // Create separate overlays for earthquakes and tectonic plates
                var overlays = {
                    'Earthquakes': earthquakes,
                    'Tectonic Plates': tectonicPlates
                };

                // Add layer controls to the map
                L.control.layers({ 'Streets': streets, 'Topographic': topo }, overlays).addTo(map);

                // Add a legend for the earthquake depth
                var legend = L.control({ position: 'bottomright' });

                legend.onAdd = function(map) {
                    var div = L.DomUtil.create('div', 'info legend');
                    div.innerHTML += '<h4>Depth Legend</h4>';
                    div.innerHTML += '<br><div><span style="background-color: #ff0000; width: 20px; height: 10px; display: inline-block;"></span> Depth > 300 km</div>';
                    div.innerHTML += '<div><span style="background-color: #ff6600; width: 20px; height: 10px; display: inline-block;"></span> 200 km < Depth <= 300 km</div>';
                    div.innerHTML += '<div><span style="background-color: #ffcc00; width: 20px; height: 10px; display: inline-block;"></span> 100 km < Depth <= 200 km</div>';
                    div.innerHTML += '<div><span style="background-color: #008000; width: 20px; height: 10px; display: inline-block;"></span> Depth <= 100 km</div>';

                    return div;
                };

                legend.addTo(map);
            });
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