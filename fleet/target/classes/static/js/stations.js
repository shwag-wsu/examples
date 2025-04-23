


function fetchAndRenderStations() {
    fetch("http://localhost:8080/fleet/stations")
      .then(res => res.json())
      .then(stations => {
        stations.forEach(station => {
          CreateStationButton(station);
          L.circleMarker([station.latitude, station.longitude], {
            radius: 8,
            color: 'blue',
            fillColor: '#007BFF',
            fillOpacity: 0.8
          })
          .addTo(map)
          .bindPopup(`<strong>${station.name}</strong>`);
        });
      });
  }
  