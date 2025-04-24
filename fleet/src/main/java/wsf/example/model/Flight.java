package wsf.example.model;

import java.time.LocalDateTime;



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
    private FuelTruck assignedTruck;

    // Getters and setters
}