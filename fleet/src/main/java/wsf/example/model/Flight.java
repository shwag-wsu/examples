package wsf.example.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
public class Flight {
    @Id @GeneratedValue
    private Long id;

    private String flightNumber;
    private String airline;
    private String status;
    private double latitude;
    private double longitude;
    private String registration;
    private LocalDateTime arrivalTime;

    @ManyToOne
    private Airport airport;

    @OneToOne
    //@JoinColumn(name = "assigned_flight_id", unique = false) 
    @JoinColumn(name = "assigned_truck_id", unique = false)
    @JsonBackReference
    private Truck assignedTruck;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public Truck getAssignedTruck() {
        return assignedTruck;
    }
    public String getFlightNumber() {
        return flightNumber;
    }
    
    public String getAirline() {
        return airline;
    }
    
    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }
    public String getStatus() {
        return status;
    }
    public Airport getAirport() {
        return airport;
    }
    public String getRegistration() { return registration; }

    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }

    public void setAssignedTruck(Truck assignedTruck) {
        this.assignedTruck = assignedTruck;
    }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public void setRegistration(String registration) { this.registration = registration; }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber =flightNumber;
        
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    public void setAirport(Airport airport) {
        this.airport = airport;
    }
}