package wsf.example.model;

import java.time.Instant;

public class Alert {
    private String type; // e.g. "FUEL_LOW", "TRAFFIC", etc.
    private String message;
    private Instant timestamp;

    public Alert() {}
    public Alert(String type, String message) {
        this.type = type;
        this.message = message;
        this.timestamp = Instant.now();
    }

    // Getters and setters
}