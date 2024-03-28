import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});


/*
ISO3 	Country Name 	lat_min 	lat_max 	lon_min 	lon_max
UT      Austria 	    46.3722761 	49.0205305 	9.5307487 	17.160776
CZE 	Czech Republic 	48.5518083 	51.0557036 	12.0905901 	18.859216 
*/


var map = L.map('map').fitBounds([[46.3722761, 9.5307487], [51.0557036, 18.859216]]);
CartoDB_PositronNoLabels.addTo(map);

const data = await d3.tsv("/data/djaw-locations.tsv");

for (var i in data) {
    var row = data[i];

    console.log(row.name_modern)

    const customPopup = `<h1>${row.name_modern != "" ? row.name_modern : row.name_historical}</h1>`


    var marker = L.marker([row.lat, row.lon], {
        opacity: 1
    }).bindPopup(customPopup);

    marker.addTo(map);


}




