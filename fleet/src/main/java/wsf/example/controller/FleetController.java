package wsf.example.controller;

//import wsf.example.model.FuelTruck;
import wsf.example.model.Truck;
//import wsf.example.model.Station;
import wsf.example.service.FleetService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

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
    //@GetMapping
    //public List<Truck> getAllTrucks() {
     //   return service.getAllTrucks();
    //}

   // @GetMapping("/{id}")
   // public Truck getTruck(@PathVariable Long id) {
    //    return service.getTruckById(id).orElseThrow(() -> new RuntimeException("Truck not found"));
   // }
  //  @GetMapping("/stations")
  //  public List<Station> getStations() {
   //     return service.getAllStations();
   // }
   
}