
import { map } from './map.js';
import { buildFlightPopup,flightIcon } from './utils.js';

export const flightmarkers = {};

export function fetchAndRenderFlights() {
  fetch('/api/flights')
    .then(res => res.json())
    .then(flights => {
      flights.forEach(flight => {
        if (flightmarkers[flight.id]) {
            flightmarkers[flight.id].setLatLng([flight.latitude, flight.longitude]);
            flightmarkers[flight.id].bindPopup(buildFlightPopup(flight));
        } else {
          const flightmarker = L.marker([flight.latitude, flight.longitude],{ icon: flightIcon(flight)})
            .addTo(map)
            .bindPopup(buildFlightPopup(flight));
            flightmarkers[flight.id] = flightmarker;
        }
      });
    });
}



export function setupFlightSSE() {
  const eventSource = new EventSource('/api/fleet/flights/stream');
  eventSource.addEventListener("flight-update", (e) => {
    const flights = JSON.parse(e.data);
    flights.forEach(flight => {
        //const lat = flight.airport.latitude + flight.latitude;
        //const lng = flight.airport.longitude + flight.longitude;

       // console.log(flight);
        if (flightmarkers[flight.id]) {

            flightmarkers[flight.id].setLatLng([flight.latitude, flight.longitude]);
            flightmarkers[flight.id].bindPopup(buildFlightPopup(flight));
        //markers[truck.id].setLatLng([truck.latitude, truck.longitude]);
        //markers[truck.id].bindPopup(buildTruckPopup(truck));
      }
    });
  });
}
