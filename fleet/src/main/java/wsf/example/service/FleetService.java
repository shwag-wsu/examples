package wsf.example.service;

//import wsf.example.model.FuelTruck;
import wsf.example.model.Truck;
//import wsf.example.model.Station;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class FleetService {
    private final Map<Long,Truck> trucks = new ConcurrentHashMap<>();
   // private final Map<String, Station> stations = new ConcurrentHashMap<>();

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter registerEmitter() {
        SseEmitter emitter = new SseEmitter(0L); // never timeout
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }
    public void broadcastTrucks(List<Truck> trucks) {
        System.out.println("Broadcasting to " + emitters.size() + " clients...");
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                    .name("truck-update")
                    .data(trucks));
            } catch (Exception ex) {
                emitters.remove(emitter);
            }
        }
    }


   // public List<Station> getAllStations() {
   //     return new ArrayList<>(stations.values());
   // }

   // public void preloadStations(List<Station> list) {
   //     for (Station s : list) {
    //        stations.put(s.getId(), s);
    //    }
   // }

    public List<Truck> getAllTrucks() {
        return new ArrayList<>(trucks.values());
    }

    public Optional<Truck> getTruckById(Long id) {
        return Optional.ofNullable(trucks.get(id));
    }

    public void updateTruck(Truck truck) {
        trucks.put(truck.getId(), truck);
    }

    public void preloadTrucks(List<Truck> list) {
        for (Truck truck : list) {
            trucks.put(truck.getId(), truck);
        }
    }
}