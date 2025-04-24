import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './style.css';

import 'bootstrap';
import { Modal } from 'bootstrap';
import L from 'leaflet';

const API_BASE = window.API_BASE || 'http://44.206.236.105';

let alertCount = 0;
let chatCount = 0;

// Your original map.js logic here, e.g.:
const map = L.map('map').setView([25.774, -80.19], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = {};

// Fuel color logic
const getColorClass = (qty) => {
  if (qty < 3000) return 'background-color:#EF4444'; // red
  if (qty < 6000) return 'background-color:#F59E0B'; // orange
  return 'background-color:#22C55E'; // green
};




function CreateStationButton(station) {
const CustomButtonControl = L.Control.extend({
  onAdd: function () {
    const container = L.DomUtil.create('div');
    container.className = 'leaflet-bar leaflet-control bg-white shadow-sm p-1';
    
    const button = L.DomUtil.create('button', 'btn btn-sm btn-primary', container);
    button.innerHTML = station.name;

    L.DomEvent.on(button, 'click', function (e) {
      e.stopPropagation();
      map.setView([station.latitude, station.longitude], 10); // Set your default view here
    });

    return container;
  }
});
map.addControl(new CustomButtonControl({ position: 'topright' }));
}

function truckIcon(truck) {

return L.divIcon({
              className: '',
              html: `
                <div style="width: 60px; text-align: center; font-family: sans-serif;">
                  <div style="font-size: 28px;">🚚</div>
                  <div style="font-size: 12px; font-weight: bold; color: #111;">${truck.driverName}</div>
                  <div style="height: 6px; width: 100%; background-color: #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${Math.min(truck.fuelQty / 100, 100)}%; ${getColorClass(truck.fuelQty)};"></div>
                  </div>
                </div>
              `,
            });

}

function fetchAndRenderTrucks() {
  fetch(API_BASE +"/api/fleet")
    .then(res => res.json())
    .then(data => {
      data.forEach(truck => {
        const { id, driverName, latitude, longitude } = truck;

        // If marker exists, just update position
        if (markers[id]) {
          markers[id].setLatLng([latitude, longitude]);
        } else {
          const marker = L.marker([latitude, longitude],{ icon: truckIcon(truck)})
            .addTo(map)
            .bindPopup(`${driverName}`)
            .on("click", () => showTruckDetails(id));
          markers[id] = marker;
        }
      });
    });
}
//var myIcon = L.divIcon({className: 'my-div-icon'});
// you can set .my-div-icon styles in CSS

//L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);





function fetchAndRenderStations() {
  fetch(API_BASE +"/api/fleet/stations")
    .then(res => res.json())
    .then(stations => {
      stations.forEach(station => {
        CreateStationButton(station);

        const stationIcon = L.divIcon({
          className: '',
          html: `
           <div style="width: 80px; text-align: center; font-family: sans-serif;">
                  <div style="font-size: 24px;">⛽️</div>
                  <div style="font-size: 11px; font-weight: bold; margin-bottom: 2px; color: #111;">${station.name}</div>
                  <div style="height: 6px; width: 100%; background-color: #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${Math.min((station.fuelQty ?? 0) / 100, 100)}%; ${getColorClass(station.fuelQty ?? 0)};"></div>
                  </div>
                </div>
          `
        });

        L.marker([station.latitude, station.longitude], { icon: stationIcon })
          .addTo(map)
          .bindPopup(`<strong>${station.name}</strong>`);
      });
    });
}
function showTruckDetails(id) {
  fetch(`${API_BASE}/api/fleet/${id}`)
    .then(res => res.json())
    .then(truck => {
      const modal = new Modal(document.getElementById("truckModal"));
      const details = `
        <strong>Driver:</strong> ${truck.driverName}<br>
        <strong>Fuel Qty:</strong> ${truck.fuelQty} L<br>
        <strong>Next Stop:</strong> ${truck.nextDestination}<br>
        <strong>ETA:</strong> ${truck.etaMinutes} minutes<br>
        <strong>Orders:</strong> <ul>${
          truck.currentOrders.map(o => `<li>${o}</li>`).join("")
        }</ul>
      `;
      document.getElementById("truckDetails").innerHTML = details;
      modal.show();
    });
}
// Replace polling with SSE
function setupSSE() {
  const eventSource = new EventSource(API_BASE +"/api/fleet/stream");

  eventSource.addEventListener("truck-update", (e) => {
    const trucks = JSON.parse(e.data);
    trucks.forEach(truck => {
      const { id, driverName, latitude, longitude } = truck;

      if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
      } else {
        const marker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(`${driverName}`)
          .on("click", () => showTruckDetails(id));
        markers[id] = marker;
      }
    });
  });

  eventSource.onerror = () => {
    console.error("SSE error or disconnected.");
    eventSource.close(); // reconnect logic could go here
  };
}
function updateBadge(id, count) {
    const badge = document.getElementById(`${id}-badge`);
    if (badge) {
      if (count > 0) {
        badge.style.display = 'inline-block';
        badge.innerText = count;
      } else {
        badge.style.display = 'none';
      }
    }
  }
function handleButtonClick(id) {
    switch(id) {
      case 'stationsBtn':
        map.setView([25.774, -80.19], 10); // Example zoom to station region
        break;
      case 'dashboardBtn':
        new Modal(document.getElementById('dashboardModal')).show();
        break;
      case 'alertsBtn':
        new Modal(document.getElementById('alertsModal')).show();
        break;
      case 'chatBtn':
        new Modal(document.getElementById('chatModal')).show();
        break;
    }
  }

function CreateToolbar() {
const CustomPanelControl = L.Control.extend({
    onAdd: function () {
      const container = L.DomUtil.create('div', 'leaflet-bar flex-column d-flex gap-1 p-2 bg-white shadow');
  
     // Station Dropdown
    const dropdown = L.DomUtil.create('div', 'dropdown', container);
    dropdown.innerHTML = `
    <div class="btn-group dropend">
      <button class="btn btn-sm btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
        <i class="fas fa-gas-pump"></i>
      </button>
      <ul class="dropdown-menu" id="stationsDropdown">
        <!-- Stations will be dynamically added here -->
        <li><a href="">Station1</a></li>
        <li><a href="">Station2</a></li>
      </ul>
      </div>
    `;

    // Prevent map from closing dropdown
    L.DomEvent.disableClickPropagation(dropdown);

      const buttons = [
        { icon: '<i class="fas fa-chart-bar"></i>', title: 'Dashboard', id: 'dashboardBtn' },
        { icon: '<i class="fas fa-exclamation-triangle"></i>', title: 'Alerts', id: 'alertsBtn' },
        { icon: '<i class="fas fa-comments"></i>', title: 'Chat', id: 'chatBtn' },
      ];
      buttons.forEach(btn => {
        const el = L.DomUtil.create('button', 'btn btn-sm btn-outline-primary position-relative', container);
        el.innerHTML = btn.icon;
        el.title = btn.title;
        el.id = btn.id;
        el.style.width = '36px';
        el.style.height = '36px';
       
    // Badge element
    const badge = L.DomUtil.create('span', 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger', el);
    badge.id = `${btn.id}-badge`;
    badge.innerText = ''; // Start empty
    badge.style.display = 'none'; // Hidden initially
    badge.style.fontSize = '0.65rem';

        // prevent map from eating click
        L.DomEvent.on(el, 'mousedown dblclick click', L.DomEvent.stopPropagation)
                  .on(el, 'click', () => handleButtonClick(btn.id));
      });
  
      return container;
    }
  });
  
map.addControl(new CustomPanelControl({ position: 'topleft' }));
}

document.getElementById('chatModal').addEventListener('hidden.bs.modal', () => {
    chatCount = 0;
    updateBadge('chatBtn', 0);
  });
  
  document.getElementById('alertsModal').addEventListener('hidden.bs.modal', () => {
    alertCount=0;
    updateBadge('alertsBtn', 0);
  });
// Initial load + polling
CreateToolbar();
fetchAndRenderTrucks();
fetchAndRenderStations();
setupSSE(); 


//setInterval(() => {
  // Simulate an alert
  //alertCount++;
  //updateBadge('alertsBtn', alertCount);
  //console.log(`New alert #${alertCount}`);
//}, 7000); // every 7 sec

//setInterval(() => {
  // Simulate chat
  //chatCount++;
  //updateBadge('chatBtn', chatCount);
  //console.log(`New chat message #${chatCount}`);
//}, 5000); // every 5 sec

//setInterval(fetchAndRenderTrucks, 5000);