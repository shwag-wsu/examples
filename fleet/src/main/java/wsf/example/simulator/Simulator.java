package wsf.example.simulator;
import wsf.example.model.Truck;
import wsf.example.model.Truck.TruckStatus;
import wsf.example.model.Alert;
import wsf.example.model.Flight;
import wsf.example.model.FuelTruck;
import wsf.example.model.Station;

import wsf.example.service.AlertService;
import wsf.example.service.FleetService;
import wsf.example.service.FlightService;
import wsf.example.service.TruckService;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class Simulator {
    private final FleetService fleetService;
    private final TruckService truckService;
    private final AlertService alertService;
    private final FlightService flightService;

    private final Random rand = new Random();

    public Simulator(FleetService fleetService,TruckService truckService,AlertService alertService,FlightService flightService) {
        this.fleetService = fleetService;
        this.truckService = truckService;
        this.alertService = alertService;
        this.flightService = flightService;
    }

    @PostConstruct
   public void init() {
    //   fleetService.preloadStations(List.of(
      //  new Station("station-01", "Depot Miami", 25.7617, -80.1918,10000),
      //  new Station("station-02", "Depot Fort Lauderdale", 26.1224, -80.1373,20000),
      //  new Station("station-03", "Depot Tampa", 27.9506, -82.4572,5000),
      //  new Station("station-04", "Depot Orlando", 28.5383, -81.3792,1000)
    //));
    List<Truck> trucks = truckService.getAllTrucks();
    List<Flight> flights = flightService.getAllFlights();
    
    //List<FuelTruck> trucks = List.of(
     //   new FuelTruck("truck-001", "Alice", 25.77, -80.19, 8000, "Depot Miami", 12, List.of("ORD001", "ORD002")),
     //   new FuelTruck("truck-002", "Bob", 25.78, -80.18, 6000, "Depot Fort Lauderdale", 10, List.of("ORD003")),
     //   new FuelTruck("truck-003", "Carlos", 26.1, -80.15, 5000, "Depot Fort Lauderdale", 9, List.of("ORD004")),
     //   new FuelTruck("truck-004", "Diana", 27.94, -82.45, 7500, "Depot Tampa", 14, List.of("ORD005")),
     //   new FuelTruck("truck-005", "Eli", 28.53, -81.38, 8200, "Depot Orlando", 11, List.of("ORD006", "ORD007")),
     //   new FuelTruck("truck-006", "Faye", 25.75, -80.2, 6600, "Depot Miami", 13, List.of("ORD008")),
     //   new FuelTruck("truck-007", "Gabe", 27.95, -82.46, 7900, "Depot Tampa", 7, List.of("ORD009")),
     //   new FuelTruck("truck-008", "Hana", 28.54, -81.39, 5400, "Depot Orlando", 8, List.of("ORD010")),
      //  new FuelTruck("truck-009", "Ivan", 25.76, -80.21, 4700, "Depot Miami", 15, List.of("ORD011")),
       // new FuelTruck("truck-010", "Jade", 26.12, -80.14, 5000, "Depot Fort Lauderdale", 10, List.of("ORD012"))
    //);

    fleetService.preloadTrucks(trucks);
    fleetService.preloadFlights(flights);

    }
    /* 
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
        fleetService.getAllFlights().forEach(flight -> {
        
            double step = 0.01; // Controls speed of movement

            double destLat = flight.getAirport().getLatitude(); // Assuming airport is attached to flight
            double destLon = flight.getAirport().getLongitude();
            
            double currLat = flight.getLatitude();
            double currLon = flight.getLongitude();
            
            double deltaLat = destLat - currLat;
            double deltaLon = destLon - currLon;
            
            double distance = Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon);
            double distanceKm = Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon) * 111; // crude km estimation
            
            if (distance > 0.0005) { // Threshold: stop moving when "close enough"
                flight.setLatitude(currLat + step * deltaLat / distance);
                flight.setLongitude(currLon + step * deltaLon / distance);
            }
            if (distanceKm < 10 && !flight.getStatus().equals("ARRIVING")) {
               
                alertService.sendAlert(new Alert("INFO","Flight " + flight.getFlightNumber() + " is approaching " + flight.getAirport().getName()));
                flight.setStatus("ARRIVING"); // optionally update status
            }


        
            fleetService.updateFlight(flight);
        });
        fleetService.broadcastFlights(fleetService.getAllFlights());
        
    } */
    @Scheduled(fixedRate = 5000)
    public void simulateMovement() {
        List<Truck> trucks = fleetService.getAllTrucks();
        List<Flight> flights = fleetService.getAllFlights();

        // Flights
        for (Flight flight : flights) {
            double destLat = flight.getAirport().getLatitude();
            double destLon = flight.getAirport().getLongitude();
            double currLat = flight.getLatitude();
            double currLon = flight.getLongitude();

            double deltaLat = destLat - currLat;
            double deltaLon = destLon - currLon;
            double distance = Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon);
            double distanceKm = distance * 111;

            if (!"ARRIVED".equals(flight.getStatus()) && distanceKm > 0.2) {
                double step = 0.01;
                flight.setLatitude(currLat + step * deltaLat / distance);
                flight.setLongitude(currLon + step * deltaLon / distance);
            }

            if (distanceKm <= 9 && !flight.getStatus().equals("ARRIVING")) {
                flight.setStatus("ARRIVING");
                //alertService.sendAlert(new Alert("INFO", "Flight " + flight.getFlightNumber() + " is approaching " + flight.getAirport().getName()));
            }

            if (distanceKm <= 1 && !"ARRIVED".equals(flight.getStatus())) {
                flight.setStatus("ARRIVED");
            
                // Snap to a fixed gate position (simplified)
                int flightIndex = flights.indexOf(flight);
                double offsetLat = (flightIndex % 5) * 0.0002; // stack linearly
                double offsetLon = (flightIndex / 5) * 0.0002;
                flight.setLatitude(flight.getAirport().getLatitude() + offsetLat);
                flight.setLongitude(flight.getAirport().getLongitude() + offsetLon);

            
                //fleetService.updateFlight(flight);
                //alertService.sendAlert(new Alert("INFO", "Flight " + flight.getFlightNumber() + " has arrived at " + flight.getAirport().getName()));
            }
            fleetService.updateFlight(flight);
        }

        // Assign flights at gate to trucks
        for (Flight flight : flights) {
            if ("ARRIVED".equals(flight.getStatus()) && !flight.isFueled()) {
                boolean alreadyAssigned = trucks.stream()
        .anyMatch(t -> t.getAssignedFlights().contains(flight));
                if (!alreadyAssigned) {
                    Truck nearest = truckService.findNearestAvailableTruck(flight.getLatitude(), flight.getLongitude());
                    if (nearest != null) {
                        System.out.println("Truck " + nearest.getDriverName() + " is getting assigned");
                        nearest.assignFlight(flight);
                        nearest.setStatus(TruckStatus.EN_ROUTE);
                        System.out.println("Truck " + nearest.getDriverName() + " status "+ nearest.getStatus());
                        
                        fleetService.updateTruck(nearest);
                        alertService.sendAlert(new Alert("INFO", "Flight " + flight.getFlightNumber() + " has been assigned to truck " +nearest.getDriverName()));
                        System.out.println("Truck " + nearest.getDriverName() + " status "+ nearest.getStatus());
                    }
                }
            }

        }
        fleetService.broadcastTrucks(trucks);
        // Truck logic
        for (Truck truck : trucks) {
            if (truck.getAssignedFlights().isEmpty()) {
                System.out.println("Truck " + truck.getDriverName() + " is available. No assigned flights.");
                truck.setStatus(TruckStatus.AVAILABLE);
                fleetService.updateTruck(truck);
                continue;   
            }

            Flight target = truck.getAssignedFlights().get(0);
            double dx = target.getLatitude() - truck.getLatitude();
            double dy = target.getLongitude() - truck.getLongitude();
            double dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.005) {
                if (!TruckStatus.REFUELING.equals(truck.getStatus())) {
                    truck.setStatus(TruckStatus.REFUELING);
                    if (truck.getFuelingStart() == 0) {
                        truck.setFuelingStart(System.currentTimeMillis());
                    }
                    

                } 
                long elapsed = System.currentTimeMillis() - truck.getFuelingStart();
                    System.out.println("Truck " + truck.getDriverName() + " refueling elapsed: " + elapsed + "ms");
                //else if (System.currentTimeMillis() - truck.getFuelingStart() > 15000) {
                    if (elapsed > 15000) {
                    target.setFueled(true);
                    truck.getAssignedFlights().remove(0);
                    truck.setFuelingStart(0);
                    truck.setStatus(truck.getAssignedFlights().isEmpty() ? TruckStatus.AVAILABLE : TruckStatus.EN_ROUTE);
                }
            } else {
                double step = 0.001;
                truck.setLatitude(truck.getLatitude() + step * dx / dist);
                truck.setLongitude(truck.getLongitude() + step * dy / dist);
            }

            fleetService.updateTruck(truck);
            System.out.println("Truck " + truck.getDriverName() + " status: " + truck.getStatus() +
            ", flights: " + truck.getAssignedFlights().size() +
            ", target: " + (target != null ? target.getFlightNumber() : "none") +
            ", dist: " + dist);
            
        }
      
        fleetService.broadcastFlights(flights);
        fleetService.broadcastTrucks(trucks);
    }

}