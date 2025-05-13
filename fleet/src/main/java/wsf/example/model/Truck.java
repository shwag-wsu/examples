package wsf.example.model;

import jakarta.persistence.*;
import wsf.example.model.Truck.TruckStatus;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Truck {

    @Id
    @GeneratedValue
    private Long id;

    private String driverName;
    private double latitude;
    private double longitude;
    private int fuelQty;
    private String nextDestination;
    private int etaMinutes;
    private long fuelingStart = 0;
    //@ElementCollection
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> currentOrders;

    @Enumerated(EnumType.STRING)
    private TruckStatus status;
/*  Removing one to one relationship  
    @OneToOne(fetch = FetchType.EAGER)
    @JsonManagedReference
    private Flight assignedFlight;
*/
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "truck_id")
    @JsonManagedReference
    private List<Flight> assignedFlights = new ArrayList<>();


    public enum TruckStatus {
        AVAILABLE,
        ASSIGNED,
        EN_ROUTE,
        REFUELING
    }

    public Truck() {}

    public Truck(String driverName, double latitude, double longitude, int fuelQty,
                 String nextDestination, int etaMinutes, TruckStatus status,
                 List<String> currentOrders, List<Flight> assignedFlights) {
        this.driverName = driverName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.fuelQty = fuelQty;
        this.nextDestination = nextDestination;
        this.etaMinutes = etaMinutes;
        this.status = status;
        this.currentOrders = currentOrders;
        this.assignedFlights = assignedFlights;
    }

    // Add getters here so data can serialize to JSON
    public Long getId() { return id; }
    public String getDriverName() { return driverName; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public int getFuelQty() { return fuelQty; }
    public String getNextDestination() { return nextDestination; }
    public int getEtaMinutes() { return etaMinutes; }
    public List<String> getCurrentOrders() { return currentOrders; }
    public TruckStatus getStatus() { return status; }
   // public Flight getAssignedFlight() { return assignedFlight; }
    public List<Flight> getAssignedFlights() {
    return assignedFlights;
    }
    public long getFuelingStart() {
        return fuelingStart;
    }

    // Setters (if needed for updates)
    public void setId(Long id) { this.id = id; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public void setFuelQty(int fuelQty) { this.fuelQty = fuelQty; }
    public void setNextDestination(String nextDestination) { this.nextDestination = nextDestination; }
    public void setEtaMinutes(int etaMinutes) { this.etaMinutes = etaMinutes; }
    public void setCurrentOrders(List<String> currentOrders) { this.currentOrders = currentOrders; }
    public void setStatus(TruckStatus status) { this.status = status; }
   // public void setAssignedFlight(Flight assignedFlight) { this.assignedFlight = assignedFlight; }
    public void setAssignedFlights(List<Flight> assignedFlights) {
        this.assignedFlights = assignedFlights;
    }
    public void assignFlight(Flight flight) {
        System.out.println("ASSGINING FLIGHTS"+ assignedFlights.size());
        if (!assignedFlights.contains(flight)) {

            assignedFlights.add(flight);
            System.out.println("FLIGHTS ASSIGNED");
            
        }
        System.out.println("ASSGINING FLIGHTS final "+ assignedFlights.size());
    }
    public void setFuelingStart(long fuelingStart) {
        this.fuelingStart = fuelingStart;
    }

}