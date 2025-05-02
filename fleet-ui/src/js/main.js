// 📦 Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import '../style.css'; // assumes your style.css is in /src

// 🧠 Bootstrap JS (modals, alerts, dropdowns)
//import 'bootstrap';
import { Modal } from 'bootstrap';
import { map } from './map.js';
// 🗺️ App logic modules
import { CreateToolbar, UpdateNavbar } from './toolbar.js';
import { fetchAndRenderTrucks, setupTruckSSE } from './truckService.js';

import { setupAlertSSE } from './alertService.js';
import { setupFlightSSE, fetchAndRenderFlights } from './flightService.js';
import { fetchAndRenderAirports } from './airportService.js';
import { showAirportDetails, assignFlightToTruck,showProfile,showDashboard } from './modalService.js';

// 🚀 Initialize the app
//CreateToolbar();
//UpdateNavbar();
showProfile();
fetchAndRenderTrucks();
fetchAndRenderAirports();
fetchAndRenderFlights();

setupTruckSSE();
setupAlertSSE();
setupFlightSSE();

// 🌐 Expose global functions for inline HTML usage
window.showAirportDetails = showAirportDetails;
window.assignFlightToTruck = assignFlightToTruck;

document.getElementById("dashboardMenu").addEventListener("click", showDashboard);
document.getElementById("alertsMenu").addEventListener("click", () => {
  new Modal(document.getElementById("alertsModal")).show();
});
  document.getElementById("refreshMenu").addEventListener("click", () => {
    map.setView([39.8283, -98.5795], 4);
  });