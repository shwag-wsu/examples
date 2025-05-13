import { map } from './map.js';
import { showAirportDetails } from './modalService.js';



import { getDistanceFromLatLonInKm } from './utils.js';

export function fetchAndRenderAirports() {
  const airportsDropdown = document.getElementById("airportsDropdown");

  fetch('/api/airports')
    .then(res => res.json())
    .then(airports => {
      airports.forEach(airport => {
        Promise.all([
          fetch(`/api/flights/airport/${airport.id}`).then(r => r.json()),
          fetch('/api/trucks').then(r => r.json())
        ]).then(([flights, trucks]) => {
          const arrivalCount = flights.length;

          const nearbyTrucks = trucks.filter(t =>
            getDistanceFromLatLonInKm(airport.latitude, airport.longitude, t.latitude, t.longitude) < 5
          );
          const available = nearbyTrucks.filter(t => t.status === 'AVAILABLE').length;
          const assigned = nearbyTrucks.filter(t => t.status === 'ASSIGNED').length;
          const avgEta = nearbyTrucks.length > 0
            ? Math.round(nearbyTrucks.reduce((sum, t) =>
              sum + Math.round((getDistanceFromLatLonInKm(airport.latitude, airport.longitude, t.latitude, t.longitude) / 50) * 60), 0) / nearbyTrucks.length)
            : 0;

          const popupHtml = `
            <div style="font-family: sans-serif; min-width: 260px;">
              <h6 class="mb-2"><i class="fa-solid fa-tower-observation"></i> (${airport.iataCode}) ${airport.name}</h6>
              <div class="mb-2">
                <strong>Arrivals:</strong> ${arrivalCount} |
                <strong>Available Trucks:</strong> ${available} |
                <strong>Avg ETA:</strong> ${avgEta} min
              </div>
              <div style="max-height: 120px; overflow-y: auto;">
                <table class="table table-sm table-bordered mb-0">
                  <thead class="table-light"><tr><th>Flight</th><th>Status</th><th>ETA</th></tr></thead>
                  <tbody>
                    ${flights.slice(0, 5).map(f => `
                      <tr>
                        <td class="small">${f.flightNumber}</td>
                        <td><span class="badge ${f.status === 'scheduled' ? 'bg-success' : 'bg-danger'}">${f.status}</span></td>
                        <td class="small">${f.arrivalTime}</td>
                      </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;

          const airportIcon = L.divIcon({
            className: '',
            html: `
              <div style="width: 80px; text-align: center; font-family: sans-serif;">
                <div style="font-size: 28px;"><i class="fa-solid fa-tower-observation"></i></div>
                <div style="font-size: 11px; font-weight: bold;">(${airport.iataCode})</div>
              </div>
            `
          });

          L.marker([airport.latitude, airport.longitude], { icon: airportIcon })
            .addTo(map)
            .bindPopup(popupHtml);
        });

        const item = document.createElement("li");
        item.innerHTML = `<a class="dropdown-item d-flex justify-content-between align-items-center fs-6 text-dark" href="#">
          <span>(${airport.iataCode}) ${airport.name}</span>
        </a>`;
        item.querySelector('a').onclick = (e) => {
          e.preventDefault();
          map.setView([airport.latitude, airport.longitude], 15);
        };
        airportsDropdown.appendChild(item);
      });
    });
}



//  Also update the airport menu..
/*
export function fetchAndRenderAirports() {
  const airportsDropdown = document.getElementById("airportsDropdown");
  
 
  fetch('/api/airports')
    .then(res => res.json())
    .then(airports => {
      airports.forEach(airport => {
      // Fetch flight count for this airport
      fetch(`/api/flights/airport/${airport.id}`)
     .then(res => res.json())
     .then(flights => {
      const arrivalCount = flights.length;


        const airportIcon = L.divIcon({
          className: '',
          html: `
            <div style="width: 80px; text-align: center; font-family: sans-serif;">
            <div style="font-size: 28px;"><i class="fa-solid fa-tower-observation"></i></div>
              <div style="font-size: 11px; font-weight: bold;">(${airport.iataCode}) ${airport.name}</div>
            </div>
          `
        });
        L.marker([airport.latitude, airport.longitude], { icon: airportIcon })
          .addTo(map)
          .on('dblclick', () => showAirportDetails(airport.id));
     
      const item = document.createElement("li");
        //item.innerHTML = `<a class="dropdown-item fs-6 text-primary" href="#">(${airport.iataCode}) ${airport.name}</a>`;
         item.innerHTML = `<a class="dropdown-item d-flex justify-content-between align-items-center fs-6 text-dark" href="#" style="transition: background-color 0.2s;">
        <span>(${airport.iataCode}) ${airport.name}</span>
        <span class="badge bg-secondary">${arrivalCount || 0}</span>
      </a>`;
        item.querySelector('a').onclick = (e) => {
          e.preventDefault();
          map.setView([airport.latitude, airport.longitude], 15);
        };
        airportsDropdown.appendChild(item);
      });
    });
  });
} */