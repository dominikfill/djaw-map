import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

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

async function fetchAndParsTSV(url) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    const rows = data.trim().split('\n');

    const headers = rows[0].split('\t');
    const dataArray = [];

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split('\t');
      values.push(values.pop().replace('\r', ''));
      const obj = {};

      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      dataArray.push(obj);
    }

    return dataArray;
  } catch (error) {
    console.error('Errpr fetching or parsing TSV:', error);
    return [];
  }
}
function populateMap() {
  fetchAndParsTSV('map/data/djaw-locations.tsv').then((data) => {
    for (const i in data) {
      const row = data[i];

      const popup = `<h1>${
        row.name_modern != '' ? row.name_modern : row.name_historical
      }</h1>`;

      var marker = L.marker([row.lat, row.lon], {
        opacity: 1,
      }).bindPopup(popup);

      marker.addTo(map);
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
