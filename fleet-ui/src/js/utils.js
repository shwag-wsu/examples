import L from 'leaflet';

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  


// Fuel color logic
const getColorClass = (qty) => {
  if (qty < 3000) return 'background-color:#EF4444'; // red
  if (qty < 6000) return 'background-color:#F59E0B'; // orange
  return 'background-color:#22C55E'; // green
};


  export function truckIcon(truck) {
  
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
  export function buildTruckPopup(truck) {
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