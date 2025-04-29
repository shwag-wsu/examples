import { map } from './map.js';
import { Modal } from 'bootstrap';
import { showDashboard } from './modalService.js';

export function CreateToolbar() {
  const CustomPanelControl = L.Control.extend({
    onAdd: function () {
      const container = L.DomUtil.create('div', 'leaflet-bar flex-column d-flex gap-1 p-2 bg-white shadow');

      const dropdown = L.DomUtil.create('div', 'dropdown', container);

      dropdown.innerHTML = `
      <div class="btn-group dropend">
            <button class="btn btn-sm btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-plane-departure"></i> 
            </button>
            <ul class="dropdown-menu" id="airportsDropdown">
              <!-- Airports will be dynamically added here -->
            </ul>
          </div>
      `;

      const buttons = [
        { icon: '<i class="fa-solid fa-arrows-rotate"></i>', title: 'Reset', action: () => map.setView([39.8283, -98.5795], 4) },
        { icon: '<i class="fas fa-chart-bar"></i>', title: 'Dashboard', action: () => showDashboard() },
        { icon: '<i class="fas fa-exclamation-triangle"></i>', title: 'Alerts', action: () => new Modal(document.getElementById('alertsModal')).show() }
      ];

      buttons.forEach(btn => {
        const el = L.DomUtil.create('button', 'btn btn-sm btn-outline-primary position-relative', container);
        el.innerHTML = btn.icon;
        el.title = btn.title;
        el.onclick = btn.action;
      });

      return container;
    }
  });

  map.addControl(new CustomPanelControl({ position: 'topleft' }));
}