package wsf.example.model;

@Entity
public class Airport {
    @Id @GeneratedValue
    private Long id;

    private String name;
    private String iataCode;
    private double latitude;
    private double longitude;

    // Getters and setters
}