import locations from './res/data/locations.tsv?url';
import tiff from './res/czoernig_1855_ethnographic-map-of-austrian-monarchy.tif?url';
import renderPopupContent from './popup/popup.js';
import fetchAndParseTSV from './fetchData.js';
import template_url from './popup/template.html?url';

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

var url_to_geotiff_file = 'https://contabo.joaopimentel.com/img/tif/1106.tif';

fetch(tiff)
  .then((res) => res.arrayBuffer())
  .then((arrayBuffer) => {
    parseGeoraster(arrayBuffer).then((georaster) => {
      const layer = new GeoRasterLayer({
        georaster: georaster,
        opacity: 1,
        resolution: 512, // optional parameter for adjusting display resolution
      }).addTo(map);

      map.fitBounds(layer.getBounds());
    });
  });

async function populateMap() {
  const data = await fetchAndParseTSV(locations);
  const response = await fetch(template_url);
  const template = await response.text();

  const promises = data.map((row) =>
    renderPopupContent(template, row).then((popup) => {
      var marker = L.marker([row.lat, row.lon], {
        opacity: 1,
      }).bindPopup(popup);

      marker.addTo(map);
    })
  );
  await Promise.all(promises);
}

populateMap();

/*
window.onload = function () {
    if (localStorage.getItem("hasCodeRunBefore") === null) {
        data = fetchAndParseData("data/djaw-locations.tsv")
        localStorage.setItem("hasCodeRunBefore", true);
    }
}*/
