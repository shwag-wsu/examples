package wsf.example.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import wsf.example.model.Airport;
import wsf.example.service.AirportService;




@RestController
@RequestMapping("/api/airports")
public class AirportController {

    private final AirportService airportService;

    public AirportController(AirportService airportService) {
        this.airportService = airportService;
    }

    @GetMapping
    public List<Airport> getAllAirports() {
        return airportService.getAllAirports();
    }

    @GetMapping("/{id}")
    public Airport getAirport(@PathVariable Long id) {
        return airportService.getAirportById(id).orElseThrow();
    }

    @PostMapping
    public Airport createAirport(@RequestBody Airport airport) {
        return airportService.saveAirport(airport);
    }

    @DeleteMapping("/{id}")
    public void deleteAirport(@PathVariable Long id) {
        airportService.deleteAirport(id);
    }
}