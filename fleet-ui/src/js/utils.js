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

/*
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
*/

export function flightIcon(flight) {

  return L.divIcon({
    className: '',
    html: `
     <div style="width: 70px; text-align: center; font-family: sans-serif; position: relative;">
     <div style="font-size: 28px; margin-top: 12px;">✈️</div>
          <div style="font-size: 12px; font-weight: bold; color: #111;">(${flight.flightNumber}) ${flight.airline}</div>
     </div>
     `
    });
}
export function buildFlightPopup(flight) {
  return `
    <div style="text-align:center; font-family:sans-serif;">
      <h6>${flight.flightNumber}</h6>
      <p><strong>Airline:</strong>${flight.airline}</p>
      <p><strong>Status:</strong> 
        <span class="badge ${flight.status === 'SCHEDULED' ? 'bg-success' : 'bg-warning'}">
          ${flight.statuss}
        </span>
      </p>
     
    </div>
  `;
}
  export function truckIcon(truck) {
    const fuelLevel = Math.min(truck.fuelQty / 100, 100);
    const colorStyle = getColorClass(truck.fuelQty);
    const statusColor = truck.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning';
  
    return L.divIcon({
      className: '',
      html: `
        <div style="width: 70px; text-align: center; font-family: sans-serif; position: relative;">
          <div class="badge ${statusColor}" style="position:absolute; top:-8px; left:50%; transform:translateX(-50%); font-size: 10px;">
            ${truck.status}
          </div>
          <div style="font-size: 28px; margin-top: 12px;">🚚</div>
          <div style="font-size: 12px; font-weight: bold; color: #111;">${truck.driverName}</div>
  
          <!-- Fuel gauge -->
          <div style="height: 20px; width: 100%; background-color: #e5e7eb; border-radius: 10px; position: relative; overflow: hidden; margin-top: 4px;">
            <div style="height: 100%; ${colorStyle}; width: ${fuelLevel}%; transition: width 0.3s;"></div>
            <div style="position: absolute; top: 0; left: 4px; font-size: 10px; color: #333;">E</div>
            <div style="position: absolute; top: 0; right: 4px; font-size: 10px; color: #333;">F</div>
          </div>
        </div>
      `
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