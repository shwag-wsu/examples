import { map } from './map.js';
import { buildTruckPopup,truckIcon } from './utils.js';

export const markers = {};

export function fetchAndRenderTrucks() {
  fetch('/api/trucks')
    .then(res => res.json())
    .then(trucks => {
      trucks.forEach(truck => {
        if (markers[truck.id]) {
          markers[truck.id].setLatLng([truck.latitude, truck.longitude]);
          markers[truck.id].bindPopup(buildTruckPopup(truck));
        } else {
          const marker = L.marker([truck.latitude, truck.longitude],{ icon: truckIcon(truck)})
            .addTo(map)
            .bindPopup(buildTruckPopup(truck));
          markers[truck.id] = marker;
        }
      });
    });
}

export function setupTruckSSE() {
  const eventSource = new EventSource('/api/fleet/trucks/stream');
  eventSource.addEventListener("truck-update", (e) => {
    const trucks = JSON.parse(e.data);
    trucks.forEach(truck => {
      if (markers[truck.id]) {
        markers[truck.id].setLatLng([truck.latitude, truck.longitude]);
        markers[truck.id].bindPopup(buildTruckPopup(truck));
      }
    });
  });
}
