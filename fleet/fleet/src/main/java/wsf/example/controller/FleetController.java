package wsf.example.controller;

import wsf.example.model.FuelTruck;
import wsf.example.service.FleetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fleet")
@CrossOrigin // allows frontend access
public class FleetController {
    private final FleetService service;

    public FleetController(FleetService service) {
        this.service = service;
    }

    @GetMapping
    public List<FuelTruck> getAllTrucks() {
        return service.getAllTrucks();
    }

    @GetMapping("/{id}")
    public FuelTruck getTruck(@PathVariable String id) {
        return service.getTruckById(id).orElseThrow(() -> new RuntimeException("Truck not found"));
    }
}