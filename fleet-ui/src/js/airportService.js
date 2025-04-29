import { map } from './map.js';
import { showAirportDetails } from './modalService.js';
//  Also update the airport menu..
export function fetchAndRenderAirports() {
  const airportsDropdown = document.getElementById("airportsDropdown");
  
  //dropdown.querySelector("#airportsDropdown");
  //document.getElementById();

  fetch('/api/airports')
    .then(res => res.json())
    .then(airports => {
      airports.forEach(airport => {

        const airportIcon = L.divIcon({
          className: '',
          html: `
            <div style="width: 80px; text-align: center; font-family: sans-serif;">
              <div style="font-size: 30px;">✈️</div>
              <div style="font-size: 11px; font-weight: bold;">(${airport.iataCode}) ${airport.name}</div>
            </div>
          `
        });
        L.marker([airport.latitude, airport.longitude], { icon: airportIcon })
          .addTo(map)
          .on('dblclick', () => showAirportDetails(airport.id));
     
      const item = document.createElement("li");
        item.innerHTML = `<a class="dropdown-item fs-6 text-primary" href="#">(${airport.iataCode}) ${airport.name}</a>`;
        item.querySelector('a').onclick = (e) => {
          e.preventDefault();
          map.setView([airport.latitude, airport.longitude], 15);
        };
        airportsDropdown.appendChild(item);
      });
    });
}