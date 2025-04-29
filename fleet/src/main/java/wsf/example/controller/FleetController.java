package wsf.example.controller;

//import wsf.example.model.FuelTruck;
import wsf.example.model.Truck;
//import wsf.example.model.Station;
import wsf.example.service.FleetService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fleet")
@CrossOrigin // allows frontend access
public class FleetController {
    private final FleetService service;

    public FleetController(FleetService service) {
        this.service = service;
    }
    @GetMapping("/stream")
    public SseEmitter streamTrucks() {
        return service.registerEmitter();
    }
    @PostMapping("/truck/{id}/message")
    public void sendMessageToTruck(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        service.broadcastTruckMessage(id, message);
    }
    @GetMapping("/stream/flights")
        public SseEmitter streamFlights() {
        return service.registerFlightEmitter();
    }
   
}