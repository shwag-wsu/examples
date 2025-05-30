package wsf.example.service;

import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import wsf.example.model.Airport;
import wsf.example.model.Truck;
import wsf.example.model.Truck.TruckStatus;
import wsf.example.repository.AirportRepository;
import wsf.example.repository.TruckRepository;

import java.util.List;
import java.util.Random;

@Service
public class SeedService {

    private final AirportRepository airportRepo;
    private final TruckRepository truckRepo;
    private static final Logger logger = LoggerFactory.getLogger(SeedService.class);

    public SeedService(AirportRepository airportRepo,TruckRepository truckRepo) {
        this.airportRepo = airportRepo;
        this.truckRepo = truckRepo;
    }

    @PostConstruct
    public void seed() {
        if (airportRepo.count() == 0) {
            logger.info("Seeding airports...");
            airportRepo.saveAll(List.of(
                new Airport("Hartsfield–Jackson Atlanta", "ATL", 33.6407, -84.4277),
                new Airport("Los Angeles International", "LAX", 33.9416, -118.4085),
                new Airport("Seattle-Tacoma International", "SEA", 47.4502, -122.3088),
                new Airport("Denver International", "DEN", 39.8561, -104.6737),
                new Airport("John F. Kennedy International", "JFK", 40.6413, -73.7781)
            ));
        }

        if (truckRepo.count() == 0) {
            logger.info("Seeding trucks and assigning to airports...");
            List<Airport> airports = airportRepo.findAll();
            Random rand = new Random();
        
            for (int i = 1; i <= 20; i++) {
                try {
                    Airport assignedAirport = airports.get(i % airports.size());
        
                    // Tiny offset so trucks don't stack exactly on airport marker
                    double latOffset = (rand.nextDouble() - 0.5) * 0.01;  // ±0.005
                    double lngOffset = (rand.nextDouble() - 0.5) * 0.01;
        
                    Truck truck = new Truck(
                        "Driver " + i,
                        assignedAirport.getLatitude() + latOffset,
                        assignedAirport.getLongitude() + lngOffset,
                        2000 + rand.nextInt(5000), // fuel quantity
                        "Holding Bay " + i,
                        10 + rand.nextInt(30),
                        TruckStatus.AVAILABLE,
                        List.of(), null
                    );
        
                    truckRepo.save(truck);
        
                } catch (Exception e) {
                    System.err.println("Failed to seed truck: " + e.getMessage());
                }
            }
        }
    }
}