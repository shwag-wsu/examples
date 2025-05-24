import { getDistanceFromLatLonInKm } from './utils.js';
import { showAlert } from './notifications.js';
import { Modal } from 'bootstrap';

export function showProfile() {
  fetch('/api/me').then(res=>res.json()).then(user => {
    
    console.log(user);
    //console.log(user.userInfo);
    //document.getElementById('userName').innerText= user.userInfo.fullName;

    //new Modal(document.getElementById("profileModal")).show();

  });
}





export function showAirportDetails(airportId) {
  fetch(`/api/airports/${airportId}`)
    .then(res => res.json())
    .then(airport => {
      fetch(`/api/flights/airport/${airportId}`)
        .then(res => res.json())
        .then(flights => {
          fetch('/api/trucks')
            .then(res => res.json())
            .then(trucks => {
              const nearbyTrucks = trucks.filter(truck =>
                getDistanceFromLatLonInKm(airport.latitude, airport.longitude, truck.latitude, truck.longitude) < 5
              );

              const flightList = flights.map(f => `
                <tr>
                  <td>${f.flightNumber}</td>
                  <td>${f.airline}</td>
                  <td><span class="badge ${f.status === 'scheduled' ? 'bg-success' : 'bg-danger'}">${f.status}</span></td>
                  <td>${f.arrivalTime}</td>
                </tr>
              `).join("");

              const truckList = nearbyTrucks.map(t => {
                const distanceKm = getDistanceFromLatLonInKm(airport.latitude, airport.longitude, t.latitude, t.longitude);
                const etaMinutes = Math.round((distanceKm / 50) * 60);
                return `
                  <tr>
                    <td>${t.driverName}</td>
                    <td>${t.status}</td>
                    <td>${Math.round(distanceKm)} km (${etaMinutes} min)</td>
                    <td>
                      ${t.status === 'AVAILABLE' ? `<button class="btn btn-outline-primary" onclick="assignFlightToTruck(${t.id}, '${airport.id}')">Assign Flight</button>` : ''}
                    </td>
                  </tr>
                `;
              }).join("");

              document.getElementById('airportTitle').innerHTML = `(${airport.iataCode}) ${airport.name}`;
              document.getElementById('airportDetails').innerHTML = `
                <i class="fa-solid fa-plane-arrival"></i><h6>Arrivals</h6>
                <table class="table table-sm">
                  <thead><tr><th>Flight</th><th>Airline</th><th>Status</th><th>Arrival</th></tr></thead>
                  <tbody>${flightList}</tbody>
                </table>
                <hr/>
                <i class="fa-solid fa-truck"></i><h6>Nearby Trucks</h6>
                <table class="table table-sm">
                  <thead><tr><th>Driver</th><th>Status</th><th>Distance</th><th>Action</th></tr></thead>
                  <tbody>${truckList}</tbody>
                </table>
              `;

              //const airportModalEl = document.getElementById('airportModal');
              //const airportModal = Modal.getInstance(airportModalEl);
              //if (!airportModal) {
                // Only show the modal if not already open
                //new Modal(airportModalEl).show();
                //airportModal = new Modal(airportModalEl)
              //}
              new Modal(document.getElementById("airportModal")).show();
            });
        });
    });
}


/*
export function showDashboard() {
  Promise.all([
    fetch('/api/trucks').then(res => res.json()),
    fetch('/api/airports').then(res => res.json())
  ]).then(([trucks, airports]) => {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = `
      <div class="p-2">
        <h6>System Summary</h6>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Total Trucks: <strong>${trucks.length}</strong></li>
          <li class="list-group-item">Total Airports: <strong>${airports.length}</strong></li>
        </ul>
      </div>
    `;
    const dashboardModalEl = document.getElementById('dashboardModal');
    new Modal(dashboardModalEl).show();

  });
}
*/
function renderTruckChart(available, assigned, lowFuel) {
  const ctx = document.getElementById('truckChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Available', 'Assigned', 'Low Fuel'],
      datasets: [{
        label: 'Truck Metrics',
        data: [available, assigned, lowFuel],
        backgroundColor: ['#198754', '#ffc107', '#dc3545'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Truck Count' }
        }
      }
    }
  });
}
export function showDashboard() {
  Promise.all([
    fetch('/api/trucks').then(res => res.json()),
    fetch('/api/airports').then(res => res.json())
  ]).then(([trucks, airports]) => {

    // Calculate metrics
    const available = trucks.filter(t => t.status === 'AVAILABLE').length;
    const assigned = trucks.filter(t => t.status === 'ASSIGNED').length;
    const lowFuel = trucks.filter(t => t.fuelQty < 3000).length;
    const avgEta = trucks.length > 0
      ? Math.round(trucks.reduce((sum, t) => sum + (t.etaMinutes || 0), 0) / trucks.length)
      : 0;

    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = `
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6 mb-3">
            <h6>Fleet Overview</h6>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Total Trucks: <strong>${trucks.length}</strong></li>
              <li class="list-group-item">Available: <strong>${available}</strong></li>
              <li class="list-group-item">Assigned: <strong>${assigned}</strong></li>
              <li class="list-group-item">Low Fuel (< 3000L): <strong>${lowFuel}</strong></li>
              <li class="list-group-item">Average ETA: <strong>${avgEta} min</strong></li>
            </ul>
          </div>
          <div class="col-md-6 mb-3">
            <h6>Airports</h6>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Total Airports: <strong>${airports.length}</strong></li>
            </ul>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-12">
            <h6>Performance Chart</h6>
            <canvas id="truckChart" height="100"></canvas>
          </div>
        </div>
      </div>
    `;

    const dashboardModalEl = document.getElementById('dashboardModal');
    new Modal(dashboardModalEl).show();

    renderTruckChart(available, assigned, lowFuel);
  });
}

export function assignFlightToTruck(truckId, airportId) {
  fetch(`/api/flights/airport/${airportId}`)
    .then(res => res.json())
    .then(flights => {
      const availableFlights = flights.filter(f => f.status !== 'ASSIGNED');
      if (availableFlights.length === 0) {
        showAlert("No available flights to assign.");
        return;
      }
      availableFlights.sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));
      const flightToAssign = availableFlights[0];
      console.log(flightToAssign);
      console.log("Flight to assign.. "+ flightToAssign.id);
      fetch(`/api/flights/${flightToAssign.id}/assign-truck/${truckId}`, { method: 'POST' })
        .then(() => {
          //showAlert(`Truck ${truckId} assigned to flight ${flightToAssign.flightNumber}`);
          showAirportDetails(airportId); // Refresh modal
        });
    });
}