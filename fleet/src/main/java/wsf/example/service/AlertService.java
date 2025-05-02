package wsf.example.service;


import wsf.example.model.Alert;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AlertService {

    private final List<SseEmitter> alertemitters = new CopyOnWriteArrayList<>();
/* 
    public void addEmitter(SseEmitter emitter) {
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
    }
        */
    public SseEmitter registerEmitter() {
        SseEmitter alertemitter = new SseEmitter(0L); // never timeout
        alertemitters.add(alertemitter);

        alertemitter.onCompletion(() -> alertemitters.remove(alertemitter));
        alertemitter.onTimeout(() -> alertemitters.remove(alertemitter));

        return alertemitter;
    }
    public void sendAlert(Alert alert) {
        System.out.println("Sending Alerts to " + alertemitters.size() + " clients...");
        List<SseEmitter> deadEmitters = new ArrayList<>();
    
        for (SseEmitter emitter : alertemitters) {
            try {
                emitter.send(SseEmitter.event().name("alert").data(alert));
            } catch (Exception e) {
                System.out.println("Removing failed emitter: " + e.getMessage());
                deadEmitters.add(emitter);
            }
        }
    
        alertemitters.removeAll(deadEmitters);
    }
}
