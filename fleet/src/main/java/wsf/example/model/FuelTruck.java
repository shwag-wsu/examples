package wsf.example.model;

import java.util.List;

public class FuelTruck {
    private String id;
    private String driverName;
    private double latitude;
    private double longitude;
    private int fuelQty;
    private String nextDestination;
    private int etaMinutes;
    private List<String> currentOrders;

    public FuelTruck() {}

    public FuelTruck(String id, String driverName, double latitude, double longitude,
                     int fuelQty, String nextDestination, int etaMinutes, List<String> currentOrders) {
        this.id = id;
        this.driverName = driverName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.fuelQty = fuelQty;
        this.nextDestination = nextDestination;
        this.etaMinutes = etaMinutes;
        this.currentOrders = currentOrders;
    }

    // Getters and Setters
     // Getters
     public String getId() {
        return id;
    }

    public String getDriverName() {
        return driverName;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public int getFuelQty() {
        return fuelQty;
    }

    public String getNextDestination() {
        return nextDestination;
    }

    public int getEtaMinutes() {
        return etaMinutes;
    }

    public List<String> getCurrentOrders() {
        return currentOrders;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void setFuelQty(int fuelQty) {
        this.fuelQty = fuelQty;
    }

    public void setNextDestination(String nextDestination) {
        this.nextDestination = nextDestination;
    }

    public void setEtaMinutes(int etaMinutes) {
        this.etaMinutes = etaMinutes;
    }

    public void setCurrentOrders(List<String> currentOrders) {
        this.currentOrders = currentOrders;
    }
}
