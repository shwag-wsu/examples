package wsf.example.model;

import jakarta.persistence.*;
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

    //@ElementCollection
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> currentOrders;

    @Enumerated(EnumType.STRING)
    private TruckStatus status;

    @OneToOne(fetch = FetchType.EAGER)
    @JsonManagedReference
    private Flight assignedFlight;

    public enum TruckStatus {
        AVAILABLE,
        ASSIGNED,
        EN_ROUTE,
        REFUELING
    }

    public Truck() {}

    public Truck(String driverName, double latitude, double longitude, int fuelQty,
                 String nextDestination, int etaMinutes, TruckStatus status,
                 List<String> currentOrders, Flight assignedFlight) {
        this.driverName = driverName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.fuelQty = fuelQty;
        this.nextDestination = nextDestination;
        this.etaMinutes = etaMinutes;
        this.status = status;
        this.currentOrders = currentOrders;
        this.assignedFlight = assignedFlight;
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
    public Flight getAssignedFlight() { return assignedFlight; }

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
    public void setAssignedFlight(Flight assignedFlight) { this.assignedFlight = assignedFlight; }
}