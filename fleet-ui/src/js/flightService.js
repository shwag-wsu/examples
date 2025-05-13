
import { map } from './map.js';
import { buildFlightPopup,flightIcon } from './utils.js';

export const flightmarkers = {};
export const flightRoutes = {}; // Track flight route polylines

export function fetchAndRenderFlights() {
  fetch('/api/flights')
    .then(res => res.json())
    .then(flights => {
      flights.forEach(flight => {
        if (flightmarkers[flight.id]) {
            flightmarkers[flight.id].setLatLng([flight.latitude, flight.longitude]);
            flightmarkers[flight.id].bindPopup(buildFlightPopup(flight));
            flightmarkers[flight.id].setIcon(flightIcon(flight));
        } else {

          /*
          const flightmarker = L.marker([flight.latitude, flight.longitude],{ icon: flightIcon(flight)})
            .addTo(map)
            .bindPopup(buildFlightPopup(flight));
            flightmarkers[flight.id] = flightmarker;
            */
            const flightmarker = L.marker([flight.latitude, flight.longitude], {
              icon: flightIcon(flight)
            })
              .addTo(map)
              .bindPopup(buildFlightPopup(flight));
            flightmarkers[flight.id] = flightmarker;
            
            // If flight has destination info, draw route line
            if (flight.airport && flight.airport.latitude && flight.airport.longitude) {
              const route = L.polyline([
                [flight.latitude, flight.longitude],
                [flight.airport.latitude, flight.airport.longitude]
              ], { color: '#9E9E9E', dashArray: '5, 10' }).addTo(map);
              flightRoutes[flight.id] = route;
            }
        }
      });
    });
}



export function setupFlightSSE() {
  const eventSource = new EventSource('/api/fleet/flights/stream');
  eventSource.addEventListener("flight-update", (e) => {
    const flights = JSON.parse(e.data);
    flights.forEach(flight => {
        if (flightmarkers[flight.id]) {

           //flightmarkers[flight.id].setLatLng([flight.latitude, flight.longitude]);
           // flightmarkers[flight.id].bindPopup(buildFlightPopup(flight));

            flightmarkers[flight.id].setLatLng([flight.latitude, flight.longitude]);
            flightmarkers[flight.id].bindPopup(buildFlightPopup(flight));
            
            // Update route line if applicable
            if (flight.airport && flight.airport.latitude && flight.airport.longitude) {
              const routeCoords = [
                [flight.latitude, flight.longitude],
                [flight.airport.latitude, flight.airport.longitude]
              ];
              if (flightRoutes[flight.id]) {
                flightRoutes[flight.id].setLatLngs(routeCoords);
              } else {
                const route = L.polyline(routeCoords, { color: '#9E9E9E', dashArray: '5, 10' }).addTo(map);
                flightRoutes[flight.id] = route;
              }
            }


      }
    });
  });
}
