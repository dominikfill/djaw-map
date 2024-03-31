import locations from './data/djaw-all-locations.tsv?url';
import renderPopupContent from './popup/popup.js';
import fetchAndParsTSV from './fetchData.js';
import template from './popup/template.html?url';

var CartoDB_PositronNoLabels = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
  }
);

/*
ISO3 	Country Name 	lat_min 	lat_max 	lon_min 	lon_max
UT      Austria 	    46.3722761 	49.0205305 	9.5307487 	17.160776
CZE 	Czech Republic 	48.5518083 	51.0557036 	12.0905901 	18.859216 
*/

var map = L.map('map').fitBounds([
  [46.3722761, 9.5307487],
  [51.0557036, 18.859216],
]);
CartoDB_PositronNoLabels.addTo(map);

function populateMap() {
  fetchAndParsTSV(locations).then((data) => {
    for (const i in data) {
      const row = data[i];
      //console.log(JSON.stringify(row));

      renderPopupContent(template, row).then((popup) => {
        //console.log(popup);
        var marker = L.marker([row.lat, row.lon], {
          opacity: 1,
        }).bindPopup(popup);

        marker.addTo(map);
      });
    }
  });
}

populateMap();

/*
window.onload = function () {
    if (localStorage.getItem("hasCodeRunBefore") === null) {
        data = fetchAndParseData("data/djaw-locations.tsv")
        localStorage.setItem("hasCodeRunBefore", true);
    }
}*/
