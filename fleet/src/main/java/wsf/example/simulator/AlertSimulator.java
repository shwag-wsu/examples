package wsf.example.simulator;

import wsf.example.service.AlertService;

import java.util.Random;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import wsf.example.model.Alert;

@Component
public class AlertSimulator {

    private final AlertService alertService;

    public AlertSimulator(AlertService alertService) {
        this.alertService = alertService;
    }

    
    @Scheduled(fixedRate = 20000)
    public void generateFakeAlert() {
        String[] messages = {
            "Fuel below 20%",
            "Driver delayed in traffic",
            "Unexpected route change",
            "Scheduled maintenance overdue"
        };

        String message = messages[new Random().nextInt(messages.length)];
        Alert alert = new Alert("INFO", message);
        alertService.sendAlert(alert);
    }
}
