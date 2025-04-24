package wsf.example.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class Flight {
    @Id @GeneratedValue
    private Long id;

    private String flightNumber;
    private String airline;
    private String status;
    private LocalDateTime arrivalTime;

    @ManyToOne
    private Airport airport;

    @OneToOne
    @JoinColumn(name = "assigned_flight_id", unique = false) 
    private Truck assignedTruck;

    // Getters and setters
}