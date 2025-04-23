import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const API_BASE = "http://localhost:8080/fleet";

const MapView = () => {
  const [trucks, setTrucks] = useState([]);
  const [stations, setStations] = useState([]);
 
  useEffect(() => {
    axios.get(`${API_BASE}/stations`).then(res => setStations(res.data));

    const sse = new EventSource(`${API_BASE}/stream`);
    sse.addEventListener("truck-update", (e) => {
      setTrucks(JSON.parse(e.data));
    });

    return () => sse.close();
  }, []);

  const getColorClass = (qty) => {
    if (qty < 3000) return 'background-color:#EF4444'; // red-500
    if (qty < 6000) return 'background-color:#F59E0B'; // orange-500
    return 'background-color:#22C55E'; // green-500
  };
  


  return (
    
    <div className="w-full" style={{ height: "calc(100vh - 4rem)" }}>
    <MapContainer center={[25.774, -80.19]} zoom={7} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
  
      {stations.map(station => (
        <CircleMarker
          key={station.id}
          center={[station.latitude, station.longitude]}
          pathOptions={{ color: 'blue' }}
          radius={8}
        >
          <Popup>{station.name}</Popup>
        </CircleMarker>
      ))}
  
      {trucks.map(truck => (
        <Marker
          key={truck.id}
          position={[truck.latitude, truck.longitude]}
          icon={L.divIcon({
            className: `text-white text-xs p-1 rounded`,
            html: `<div style="text-align:center; ${getColorClass(truck.fuelQty)}">${truck.driverName}</div>`,

          })}
        >
          <Popup>
            <div className="text-sm">
              <strong>{truck.driverName}</strong><br />
              Fuel: {truck.fuelQty} L<br />
              Next: {truck.nextDestination}<br />
              ETA: {truck.etaMinutes} min<br />
              Orders: <ul>${truck.currentOrders.map(o => `<li>${o}</li>`).join('')}</ul>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
  );
};

export default MapView;