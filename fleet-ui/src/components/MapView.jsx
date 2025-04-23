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
    
    <div className="w-fulw-full h-screen pt-16">
    <MapContainer center={[25.774, -80.19]} zoom={7} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
  
      {stations.map(station => (
        <Marker
        key={station.id}
        position={[station.latitude, station.longitude]}
        icon={L.divIcon({
          className: '',
          html: `
            <div style="
              width: 80px;
              text-align: center;
              font-family: sans-serif;
            ">
              <div style="
                font-size: 24px;
                margin-bottom: 2px;
              ">⛽️</div>
              <div style="
                font-size: 11px;
                font-weight: bold;
                color: #111;
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">${station.name}</div>
              <div style="
                height: 6px;
                width: 100%;
                background-color: #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
              ">
                <div style="
                  height: 100%;
                  width: ${Math.min((station.fuelQty ?? 0) / 100, 100)}%;
                  ${getColorClass(station.fuelQty ?? 0)};
                "></div>
              </div>
            </div>
          `,
        })}
      />
      ))}
  
      {trucks.map(truck => (
        <Marker
          key={truck.id}
          position={[truck.latitude, truck.longitude]}
          icon={L.divIcon({
            className: '',
            html: `
              <div style="
                width: 60px;
                text-align: center;
                font-family: sans-serif;
              ">
                <div style="
                  font-size: 28px;
                  margin-bottom: 2px;
                ">🚚</div>
                <div style="
                  font-size: 12px;
                  font-weight: bold;
                  color: #111;
                  margin-bottom: 2px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">${truck.driverName}</div>
                <div style="
                  height: 6px;
                  width: 100%;
                  background-color: #e5e7eb;
                  border-radius: 4px;
                  overflow: hidden;
                ">
                  <div style="
                    height: 100%;
                    width: ${Math.min(truck.fuelQty / 100, 100)}%;
                    ${getColorClass(truck.fuelQty)};
                  "></div>
                </div>
              </div>
            `,
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