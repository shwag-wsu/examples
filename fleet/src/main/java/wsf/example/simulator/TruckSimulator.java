package wsf.example.simulator;

import wsf.example.model.FuelTruck;
import wsf.example.service.FleetService;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class TruckSimulator {
    private final FleetService fleetService;
    private final Random rand = new Random();

    public TruckSimulator(FleetService fleetService) {
        this.fleetService = fleetService;
    }

    @PostConstruct
    public void init() {
        fleetService.preloadTrucks(List.of(
            new FuelTruck("truck-001", "Alice", 25.774, -80.19, 8000, "Station 12", 15, List.of("ORD001", "ORD002")),
            new FuelTruck("truck-002", "Bob", 25.7617, -80.1918, 6000, "Station 17", 8, List.of("ORD005"))
        ));
    }

    @Scheduled(fixedRate = 5000)
    public void simulateMovement() {
        fleetService.getAllTrucks().forEach(truck -> {
            // Add small random offset to simulate movement
            truck.setLatitude(truck.getLatitude() + (rand.nextDouble() - 0.5) * 0.001);
            truck.setLongitude(truck.getLongitude() + (rand.nextDouble() - 0.5) * 0.001);
            truck.setEtaMinutes(Math.max(1, truck.getEtaMinutes() - 1)); // simulate ETA countdown
            fleetService.updateTruck(truck);
        });
    }
}