package wsf.example.simulator;

import wsf.example.model.FuelTruck;
import wsf.example.model.Station;
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
       fleetService.preloadStations(List.of(
        new Station("station-01", "Depot Miami", 25.7617, -80.1918),
        new Station("station-02", "Depot Fort Lauderdale", 26.1224, -80.1373),
        new Station("station-03", "Depot Tampa", 27.9506, -82.4572),
        new Station("station-04", "Depot Orlando", 28.5383, -81.3792)
    ));

    List<FuelTruck> trucks = List.of(
        new FuelTruck("truck-001", "Alice", 25.77, -80.19, 8000, "Depot Miami", 12, List.of("ORD001", "ORD002")),
        new FuelTruck("truck-002", "Bob", 25.78, -80.18, 6000, "Depot Fort Lauderdale", 10, List.of("ORD003")),
        new FuelTruck("truck-003", "Carlos", 26.1, -80.15, 5000, "Depot Fort Lauderdale", 9, List.of("ORD004")),
        new FuelTruck("truck-004", "Diana", 27.94, -82.45, 7500, "Depot Tampa", 14, List.of("ORD005")),
        new FuelTruck("truck-005", "Eli", 28.53, -81.38, 8200, "Depot Orlando", 11, List.of("ORD006", "ORD007")),
        new FuelTruck("truck-006", "Faye", 25.75, -80.2, 6600, "Depot Miami", 13, List.of("ORD008")),
        new FuelTruck("truck-007", "Gabe", 27.95, -82.46, 7900, "Depot Tampa", 7, List.of("ORD009")),
        new FuelTruck("truck-008", "Hana", 28.54, -81.39, 5400, "Depot Orlando", 8, List.of("ORD010")),
        new FuelTruck("truck-009", "Ivan", 25.76, -80.21, 4700, "Depot Miami", 15, List.of("ORD011")),
        new FuelTruck("truck-010", "Jade", 26.12, -80.14, 5000, "Depot Fort Lauderdale", 10, List.of("ORD012"))
    );

    fleetService.preloadTrucks(trucks);
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
        fleetService.broadcastTrucks(fleetService.getAllTrucks());
    }
}