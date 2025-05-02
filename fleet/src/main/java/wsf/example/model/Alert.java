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
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}