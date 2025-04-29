// 📦 Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import '../style.css'; // assumes your style.css is in /src

// 🧠 Bootstrap JS (modals, alerts, dropdowns)
import 'bootstrap';

// 🗺️ App logic modules
import { CreateToolbar } from './toolbar.js';
import { fetchAndRenderTrucks, setupTruckSSE } from './truckService.js';
import { fetchAndRenderAirports } from './airportService.js';
import { showAirportDetails, assignFlightToTruck,showProfile } from './modalService.js';

// 🚀 Initialize the app
CreateToolbar();
showProfile();
fetchAndRenderTrucks();
fetchAndRenderAirports();
setupTruckSSE();

// 🌐 Expose global functions for inline HTML usage
window.showAirportDetails = showAirportDetails;
window.assignFlightToTruck = assignFlightToTruck;