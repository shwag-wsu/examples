package wsf.example.scheduler;

import wsf.example.model.Flight;
import wsf.example.model.Airport;
import wsf.example.service.FlightApiService;
import wsf.example.service.FlightService;
import wsf.example.service.AirportService;
import wsf.example.service.FleetService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class FlightScheduler {

    private final FlightApiService flightApiService;
    private final FlightService flightService;
    private final AirportService airportService;
    private final FleetService fleetService; // for broadcasting new flights

    public FlightScheduler(FlightApiService flightApiService, FlightService flightService,
                            AirportService airportService, FleetService fleetService) {
        this.flightApiService = flightApiService;
        this.flightService = flightService;
        this.airportService = airportService;
        this.fleetService = fleetService;
    }

    //@Scheduled(fixedRate = 300000) // every 5 minutes (300,000 ms)
    public void pollArrivals() {
        System.out.println("Polling new flight arrivals...");

        airportService.getAllAirports().forEach(airport -> {
            try {
                //List<Flight> fetchedFlights = flightApiService.fetchArrivals(airport.getIataCode(), airport);
                List<Flight> recentFlights = flightApiService.fetchArrivals(airport.getIataCode(), airport);
                /* 
                List<Flight> recentFlights = fetchedFlights.stream()
                    .filter(f -> f.getArrivalTime() != null &&
                                 f.getArrivalTime().isAfter(LocalDateTime.now()) &&
                                 f.getArrivalTime().isBefore(LocalDateTime.now().plusHours(2)))
                    .toList();
                    */
                // Save to DB and broadcast
                for (Flight flight : recentFlights) {
                    flightService.createFlight(flight);
                }

                if (!recentFlights.isEmpty()) {
                    fleetService.broadcastFlights(recentFlights); // if you want real-time UI updates
                }

            } catch (Exception ex) {
                System.err.println("Failed to fetch arrivals for airport " + airport.getIataCode());
                ex.printStackTrace();
            }
        });
    }
}