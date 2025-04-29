import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './style.css';

import 'bootstrap';
import { Modal } from 'bootstrap';
import L from 'leaflet';

//const API_BASE = window.API_BASE || 'http://44.206.236.105';

const API_BASE = 'http://localhost:8080';

let alertCount = 0;
let chatCount = 0;

// Your original map.js logic here, e.g.:
//const map = L.map('map').setView([25.774, -80.19], 10);
const map = L.map('map').setView([39.8283, -98.5795], 4);

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
//  Thank you CHATGPT
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distanceKm = R * c; // Distance in km
  return distanceKm;
}
function buildTruckPopup(truck) {
  return `
    <div style="text-align:center; font-family:sans-serif;">
      <h6>${truck.driverName}</h6>
      <p><strong>Status:</strong> 
        <span class="badge ${truck.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning'}">
          ${truck.status}
        </span>
      </p>
      <p><strong>Fuel:</strong> ${truck.fuelQty} L</p>
      <p><strong>ETA:</strong> ${truck.etaMinutes} min</p>
      ${truck.assignedFlight ? `
        <hr/>
        <p><strong>Assigned Flight:</strong> ${truck.assignedFlight.flightNumber}</p>
        <p><strong>Airline:</strong> ${truck.assignedFlight.airline}</p>
      ` : ''}
    </div>
  `;
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
  fetch(API_BASE +"/api/trucks")
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
            .bindPopup(buildTruckPopup(truck))
           // .on("click", () => showTruckDetails(id));
          markers[id] = marker;
        }
      });
    });
}
//var myIcon = L.divIcon({className: 'my-div-icon'});
// you can set .my-div-icon styles in CSS

//L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);

function showAirportDetails(airportId) {
  fetch(`${API_BASE}/api/airports/${airportId}`)
    .then(res => res.json())
    .then(airport => {
      // Fetch flights
      fetch(`${API_BASE}/api/flights/airport/${airportId}`)
        .then(res => res.json())
        .then(flights => {

          // Fetch trucks
          fetch(`${API_BASE}/api/trucks`)
            .then(res => res.json())
            .then(trucks => {
              const nearbyTrucks = trucks.filter(truck => 
                getDistanceFromLatLonInKm(
                  airport.latitude, airport.longitude,
                  truck.latitude, truck.longitude
                ) < 5 // within 5 km (~3 miles)
              );

              const modal = new Modal(document.getElementById("airportModal"));

              let flightList = flights.map(f => `
                <tr>
                  <td>${f.flightNumber}</td>
                  <td>${f.airline}</td>
                  <td><span class="badge ${f.status === 'scheduled' ? 'bg-success' : 'bg-danger'}">${f.status}</span></td>
                  <td>${f.arrivalTime}</td>
                  
                </tr>
              `).join("");

              let truckList = nearbyTrucks.map(t => {
                const distanceKm = getDistanceFromLatLonInKm(airport.latitude, airport.longitude, t.latitude, t.longitude);
                const etaMinutes = Math.round((distanceKm / 50) * 60);

                return `
                  <tr>
                    <td>${t.driverName}</td>
                    <td>${t.status}</td>
                    <td>${Math.round(distanceKm)} km (${etaMinutes} min)</td>
                    <td><button class="btn btn-sm btn-primary" onclick="assignFlightToTruck(${t.id}, '${airport.id}')">Assign Flight</button></td>
                  </tr>
                `;
              }).join("");

              const details = `
                <h6>Arrivals</h6>
                <table class="table table-sm">
                  <thead><tr><th>Flight</th><th>Airline</th><th>Status</th><th>Arrival</th><th>Action</th></tr></thead>
                  <tbody>${flightList}</tbody>
                </table>
                <hr/>
                <h6>Nearby Trucks</h6>
                <table class="table table-sm">
                  <thead><tr><th>Driver</th><th>Status</th><th>Distance</th></tr></thead>
                  <tbody>${truckList}</tbody>
                </table>
              `;
              document.getElementById("airportTitle").innerHTML = `(${airport.iataCode}) ${airport.name}`;
              document.getElementById("airportDetails").innerHTML = details;
              modal.show();
            });
        });
    });
}
function assignFlightToTruck(truckId, airportId) {
  fetch(`${API_BASE}/api/flights/airport/${airportId}`)
    .then(res => res.json())
    .then(flights => {
      const availableFlights = flights.filter(f => f.status != 'ASSIGNED');

      if (availableFlights.length === 0) {
        alert("No available flights to assign.");
        return;
      }

      // Pick the soonest arriving unassigned flight
      availableFlights.sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));
      const flightToAssign = availableFlights[0];

      fetch(`${API_BASE}/api/flights/${flightToAssign.id}/assign-truck/${truckId}`, {
        method: 'POST'
      })
      .then(() => {
        alert(`Truck ${truckId} assigned to flight ${flightToAssign.flightNumber}`);
        // Optional: Refresh modal
      });
    });
}

function fetchAndRenderAirports() {
  fetch(API_BASE +"/api/airports")
    .then(res => res.json())
    .then(airports => {
      airports.forEach(airport => {
        //CreateStationButton(station);

        const airportIcon = L.divIcon({
          className: '',
          html: `
          <div style="width: 80px; text-align: center; font-family: sans-serif;">
           <div style="font-size: 24px;">✈️</div>
                  <div style="font-size: 11px; font-weight: bold; margin-bottom: 2px; color: #111;">(${airport.iataCode}) ${airport.name}</div>
                </div>
          `
        });

        L.marker([airport.latitude, airport.longitude], { icon: airportIcon })
          .addTo(map)
          .on("dblclick", () => showAirportDetails(airport.id));
          //.bindPopup(` <div style="text-align: center;">
    //<p><strong>(${airport.iataCode}) ${airport.name}</strong></p>
   // <button class="btn btn-primary btn-sm" onclick="showAirportDetails('${airport.id}')">View Details</button>
  //</div>`);
      });
    });
}
/*
function showTruckDetails(id) {
  fetch(`${API_BASE}/api/truck/${id}`)
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
}*/
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
          .bindPopup(buildTruckPopup(truck))
         //.on("click", () => showTruckDetails(id));
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
      case 'dashboardBtn':
        new Modal(document.getElementById('dashboardModal')).show();
        break;
      case 'alertsBtn':
        new Modal(document.getElementById('alertsModal')).show();
        break;
      case 'resetBtn':
        map.setView([39.8283, -98.5795], 4); // USA center
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
          <button class="btn btn-sm btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-plane-departure"></i> 
          </button>
          <ul class="dropdown-menu" id="airportsDropdown">
            <!-- Airports will be dynamically added here -->
          </ul>
        </div>
    `;

    // Fetch airports and populate the dropdown
    fetch(`${API_BASE}/api/airports`)
    .then(res => res.json())
    .then(airports => {
      const airportsDropdown = dropdown.querySelector("#airportsDropdown");

      airports.forEach(airport => {
        const item = document.createElement("li");
        item.innerHTML = `<a class="dropdown-item text-primary fw-bold" href="#">(${airport.iataCode}) ${airport.name}</a>`;
        item.querySelector('a').onclick = (e) => {
          e.preventDefault();
          map.setView([airport.latitude, airport.longitude], 10);
        };
        airportsDropdown.appendChild(item);
      });
      
    });

    // Prevent map from closing dropdown
    L.DomEvent.disableClickPropagation(dropdown);

      const buttons = [
        { icon: '<i class="fa-solid fa-arrows-rotate"></i>', title: 'Reset', id: 'resetBtn' },
        { icon: '<i class="fas fa-chart-bar"></i>', title: 'Dashboard', id: 'dashboardBtn' },
        { icon: '<i class="fas fa-exclamation-triangle"></i>', title: 'Alerts', id: 'alertsBtn' }
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

  
  document.getElementById('alertsModal').addEventListener('hidden.bs.modal', () => {
    alertCount=0;
    updateBadge('alertsBtn', 0);
  });
// Initial load + polling
CreateToolbar();
fetchAndRenderTrucks();
fetchAndRenderAirports();
setupSSE(); 
window.showAirportDetails = showAirportDetails;
window.assignFlightToTruck = assignFlightToTruck;

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