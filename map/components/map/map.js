import locations from '../../res/data/locations.tsv?url';
import renderPopupContent from '../popup/popup.js';
import renderSidebarContent from '../sidebar/sidebar.js';
import fetchAndParseTSV from '../utils/fetchData.js';
import popupTemplate from '../popup/popup-template.html?url';
import sidebarTemplate from '../sidebar/sidebar-template.html?url';

var CartoDB_PositronNoLabels = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
  }
);

var Czoernig_1855_Ethnographic_Austrian_Monarchy = L.tileLayer(
  'https://warper.wmflabs.org/maps/tile/4000/{z}/{x}/{y}.png ',
  {
    opacity: 0.8,
  }
);

var Deutschland_XIII_Jahrhundert = L.tileLayer(
  'https://warper.wmflabs.org/maps/tile/6882/{z}/{x}/{y}.png',
  {
    opacity: 0.8,
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

// Add the layers to the map
var baseLayers = {
  'Base Layer': CartoDB_PositronNoLabels,
};

var overlayLayers = {
  'Second Layer': Czoernig_1855_Ethnographic_Austrian_Monarchy,
  'Third Layer': Deutschland_XIII_Jahrhundert,
};

L.control.layers(baseLayers, overlayLayers).addTo(map);

async function populateMap() {
  const data = await fetchAndParseTSV(locations);
  const response = await fetch(popupTemplate);
  const template = await response.text();

  const response2 = await fetch(sidebarTemplate);
  const template2 = await response2.text();

  const promises = data.map((row) => {
    return renderPopupContent(template, row).then((popup) => {
      var marker = L.marker([row.lat, row.lon], {
        opacity: 1,
      }).bindPopup(popup);

      marker.addTo(map);

      return { marker, row }; // Return both marker and row for further processing
    });
  });

  const markersAndRows = await Promise.all(promises);

  // Attach event listener after all markers have been added
  map.on('popupopen', function (e) {
    const popupNode = e.popup._contentNode;
    const button = popupNode.querySelector('#toggleSidebar');

    button.addEventListener('click', function () {
      var sidebar = document.getElementById('sidebar');

      // Find the corresponding row for the clicked popup
      const { row } = markersAndRows.find(
        ({ marker }) => marker === e.popup._source
      );

      sidebar.innerHTML = renderSidebarContent(template2, row);

      sidebar.classList.toggle('show');
    });
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
