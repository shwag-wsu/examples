const API_BASE = "http://localhost:8080/fleet";

let map = L.map('map').setView([25.774, -80.19], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = {};

function fetchAndRenderTrucks() {
  fetch(API_BASE)
    .then(res => res.json())
    .then(data => {
      data.forEach(truck => {
        const { id, driverName, latitude, longitude } = truck;

        // If marker exists, just update position
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
}
function fetchAndRenderStations() {
  fetch("http://localhost:8080/fleet/stations")
    .then(res => res.json())
    .then(stations => {
      stations.forEach(station => {
        L.circleMarker([station.latitude, station.longitude], {
          radius: 8,
          color: 'blue',
          fillColor: '#007BFF',
          fillOpacity: 0.8
        })
        .addTo(map)
        .bindPopup(`<strong>${station.name}</strong>`);
      });
    });
}
function showTruckDetails(id) {
  fetch(`${API_BASE}/${id}`)
    .then(res => res.json())
    .then(truck => {
      const modal = new bootstrap.Modal(document.getElementById("truckModal"));
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

// Initial load + polling
fetchAndRenderTrucks();
fetchAndRenderStations();
setInterval(fetchAndRenderTrucks, 5000);