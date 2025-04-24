package wsf.example.controller;

import org.springframework.web.bind.annotation.*;
import wsf.example.model.Truck;
import wsf.example.repository.TruckRepository;

import java.util.List;

@RestController
@RequestMapping("/api/trucks")
@CrossOrigin
public class TruckController {

    private final TruckRepository truckRepo;

    public TruckController(TruckRepository truckRepo) {
        this.truckRepo = truckRepo;
    }

    @GetMapping
    public List<Truck> getAllTrucks() {
        return truckRepo.findAll();
    }

    @GetMapping("/{id}")
    public Truck getTruck(@PathVariable Long id) {
        return truckRepo.findById(id).orElseThrow(() -> new RuntimeException("Truck not found"));
    }
}