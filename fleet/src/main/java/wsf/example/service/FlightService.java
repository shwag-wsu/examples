package wsf.example.service;

import org.springframework.stereotype.Service;
import wsf.example.model.Flight;
import wsf.example.model.Truck;
import wsf.example.repository.FlightRepository;
import wsf.example.repository.TruckRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FlightService {

    private final FlightRepository flightRepo;
    private final TruckRepository truckRepo;
    private final FleetService fleetService;

    public FlightService(FlightRepository flightRepo, TruckRepository truckRepo, FleetService fleetService) {
        this.flightRepo = flightRepo;
        this.truckRepo = truckRepo;
        this.fleetService = fleetService;
    }

    public List<Flight> getAllFlights() {
        return flightRepo.findAll();
    }

    public Optional<Flight> getFlightById(Long id) {
        return flightRepo.findById(id);
    }

    public Flight createFlight(Flight flight) {
        return flightRepo.save(flight);
    }

    public void deleteFlight(Long id) {
        flightRepo.deleteById(id);
    }
    public List<Flight> getFlightsByAirport(Long airportId) {
        return flightRepo.findByAirport_Id(airportId);
    }
    /* 
    public Flight assignTruckToFlight(Long flightId, Long truckId) {
    Flight flight = flightRepo.findById(flightId)
        .orElseThrow(() -> new RuntimeException("Flight not found"));
    Truck truck = truckRepo.findById(truckId)
        .orElseThrow(() -> new RuntimeException("Truck not found"));

    flight.setAssignedTruck(truck);
    flight.setStatus("ASSIGNED");

    truck.setAssignedFlight(flight);
    truck.setStatus(Truck.TruckStatus.ASSIGNED);

    truckRepo.save(truck);
    Flight savedFlight = flightRepo.save(flight);

    // ✅ Update the in-memory truck map
    fleetService.updateTruck(truck);

    // ✨ Immediately broadcast updated trucks to all connected clients
    fleetService.broadcastTrucks(truckRepo.findAll());

    return savedFlight;
    }
    */
}