package wsf.example.model;
import jakarta.persistence.*;

@Entity
public class Airport {
    @Id @GeneratedValue
    private Long id;

    private String name;
    private String iataCode;
    private double latitude;
    private double longitude;

    public Airport() {} // Required by JPA

    public Airport(String name, String iataCode, double latitude, double longitude) {
        this.name = name;
        this.iataCode = iataCode;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and setters...
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getIataCode() {
        return iataCode;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }
    
}