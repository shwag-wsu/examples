package wsf.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import wsf.example.model.Airport;
import wsf.example.model.Flight;
import wsf.example.service.AirportService;
import wsf.example.service.FlightApiService;
import wsf.example.service.FlightService;

import java.util.List;


@RestController
@RequestMapping("/api/flights")
@CrossOrigin
public class FlightController {

    private final FlightService flightService;
    private final FlightApiService flightApiService;
    private final AirportService airportService;


    public FlightController(FlightService flightService,FlightApiService flightApiService,AirportService airportService) {
        this.flightService = flightService;
        this.flightApiService = flightApiService;
        this.airportService = airportService;
    }
    

    @PostMapping("/fetch-arrivals/{iata}")
    public List<Flight> fetchAndSaveArrivals(@PathVariable String iata) 
    {
        Airport airport = airportService.findByIataCode(iata)
        .orElseThrow(() -> new RuntimeException("Airport not found"));
        List<Flight> arrivals = flightApiService.fetchArrivals(iata,airport);
        return arrivals.stream().map(flightService::createFlight).toList();
    }
    
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/{id}")
    public Flight getFlight(@PathVariable Long id) {
        return flightService.getFlightById(id).orElseThrow(() -> new RuntimeException("Flight not found"));
    }
    
    @GetMapping("/airport/{id}")
    public List<Flight> getFlightsByAirport(@PathVariable Long id) {
    return flightService.getFlightsByAirport(id);
    }
    
    @PostMapping
    public Flight createFlight(@RequestBody Flight flight) {
        return flightService.createFlight(flight);
    }
    /* 
    @PostMapping("/{flightId}/assign-truck/{truckId}")
    public Flight assignTruck(@PathVariable Long flightId, @PathVariable Long truckId) {
        return flightService.assignTruckToFlight(flightId, truckId);
    }*/
    
}