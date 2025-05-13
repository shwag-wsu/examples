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

  const statusColor = {
    'SCHEDULED': '#6c757d',
    'ARRIVING': '#ffc107',
    'ARRIVED': '#198754',
    'FUELED': '#0dcaf0'
  }[flight.status] || '#0d6efd';

  return L.divIcon({
    className: '',
    iconAnchor: [35, 20], // Adjusted to center the icon and text
    popupAnchor: [0, -20],
    html: `
     <div style="width: 70px; text-align: center; font-family: sans-serif; position: relative;">
     <div style="font-size: 28px; margin-top: 12px;">✈️</div>
          <div style="font-size: 12px; font-weight: bold; color: #111;">(${flight.flightNumber}) ${flight.airline}</div>
          <span style="
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: ${statusColor};
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 12px;
    font-weight: bold;
  ">
    ${flight.status}
  </span>
     </div>
     `
    });
}
export function buildFlightPopup(flight) {
  const airlineCode = flight.airline_iata?.toLowerCase();
  const logoUrl = airlineCode
    ? `/logos/${airlineCode}.png`
    : 'https://via.placeholder.com/32x32?text=?';

  let etaDisplay = '';
  let distanceDisplay = '';

  if (flight.airport) {
    const distanceKm = getDistanceFromLatLonInKm(
      flight.latitude,
      flight.longitude,
      flight.airport.latitude,
      flight.airport.longitude
    );
    const etaMin = Math.round((distanceKm / 900) * 60);
    etaDisplay = `<strong>ETA:</strong> ${etaMin} min`;
    distanceDisplay = `<strong>Distance:</strong> ${distanceKm.toFixed(2)} Km`;
  }
//     <div style="font-size: 16px; font-weight: bold;">${flight.flightNumber}</div>
   
  return `
     <div style="
      padding: 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(6px);
      font-family: 'Segoe UI', sans-serif;
      font-size: 14px;
      color: #111;
      min-width: 240px;
    ">
      <div class="d-flex align-items-center mb-2">
        <img src="${logoUrl}" alt="${flight.airline}" style="height: 24px; width: auto; max-width: 120px;" />
      </div>
       <div class="mb-2">
        <strong>Flight Number:</strong> ${flight.flightNumber}
        <strong>Status:</strong>
        <span class="badge ${flight.status === 'SCHEDULED' ? 'bg-success' : 'bg-warning'}">
          ${flight.status.toLowerCase()}
        </span>
      </div>
      <div class="mb-2">
      ${etaDisplay}
      ${distanceDisplay}
      </div>
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
  
         
        </div>
      `
    });
  }
  /*  <!-- Fuel gauge -->
          <div style="height: 20px; width: 100%; background-color: #e5e7eb; border-radius: 10px; position: relative; overflow: hidden; margin-top: 4px;">
            <div style="height: 100%; ${colorStyle}; width: ${fuelLevel}%; transition: width 0.3s;"></div>
            <div style="position: absolute; top: 0; left: 4px; font-size: 10px; color: #333;">E</div>
            <div style="position: absolute; top: 0; right: 4px; font-size: 10px; color: #333;">F</div>
          </div>
          */
  export function buildTruckPopup(truck) {
    return `
      <div style="text-align:center; font-family:sans-serif;">
        <strong>${truck.driverName}<strong>
         <div class="mb-2">
         <strong>Status:</strong> 
          <span class="badge ${truck.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning'}">
            ${truck.status}
          </span>
        <strong>Fuel:</strong> ${truck.fuelQty} L
        <strong>ETA:</strong> ${truck.etaMinutes} min
        </div>
        ${truck.assignedFlight ? `
          <hr/>
          <p><strong>Assigned Flight:</strong> ${truck.assignedFlight.flightNumber}</p>
          <p><strong>Airline:</strong> ${truck.assignedFlight.airline}</p>
        ` : ''}
      </div>
    `;
  }