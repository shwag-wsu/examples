package wsf.example.model;

public class Station {
    private String id;
    private String name;
    private double latitude;
    private double longitude;
    private int fuelQty;

    public Station() {}

    public Station(String id, String name, double latitude, double longitude,int fuelQty) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.fuelQty = fuelQty;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public int getFuelQty() { return fuelQty; }
    public void setFuelQty(int fuelQty ) { this.fuelQty=fuelQty; }
    
}