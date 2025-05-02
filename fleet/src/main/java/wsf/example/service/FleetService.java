package wsf.example.service;

import wsf.example.model.Flight;
import wsf.example.model.Truck;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class FleetService {
    private final Map<Long,Truck> trucks = new ConcurrentHashMap<>();
    private final Map<Long,Flight> flights = new ConcurrentHashMap<>();
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final List<SseEmitter> flightemitters = new CopyOnWriteArrayList<>();

    public SseEmitter registerEmitter() {
        SseEmitter emitter = new SseEmitter(0L); // never timeout
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }
    public SseEmitter registerFlightEmitter() {
        SseEmitter flightemitter = new SseEmitter(0L); // never timeout
        
        flightemitters.add(flightemitter);

        flightemitter.onCompletion(() -> flightemitters.remove(flightemitter));
        flightemitter.onTimeout(() -> flightemitters.remove(flightemitter));

        return flightemitter;
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
    public void broadcastTruckMessage(Long truckId, String message) {
        System.out.println("Broadcasting to TruckId:"+ truckId +" .. "+ emitters.size() + " clients...");
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                    .name("truck-message")
                    .data(Map.of(
                        "truckId", truckId,
                        "message", message
                    )));
            } catch (Exception ex) {
                emitters.remove(emitter);
            }
        }
    }
    public void broadcastFlights(List<Flight> flights) {
    System.out.println("Broadcasting flights to " + flightemitters.size() + " clients...");
    for (SseEmitter emitter : flightemitters) {
        try {
            emitter.send(SseEmitter.event()
                .name("flight-update")
                .data(flights));
        } catch (Exception ex) {
            flightemitters.remove(emitter);
        }
        }
    }

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

    public List<Flight> getAllFlights() {
        return new ArrayList<>(flights.values());
    }

    public Optional<Flight> getFlightById(Long id) {
        return Optional.ofNullable(flights.get(id));
    }
    public void updateFlight(Flight flight) {
        flights.put(flight.getId(), flight);
    }
    public void preloadFlights(List<Flight> list) {
        for (Flight flight : list) {
            flights.put(flight.getId(), flight);
        }
    }
}