package wsf.example.service;

import wsf.example.model.FuelTruck;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FleetService {
    private final Map<String, FuelTruck> trucks = new ConcurrentHashMap<>();

    public List<FuelTruck> getAllTrucks() {
        return new ArrayList<>(trucks.values());
    }

    public Optional<FuelTruck> getTruckById(String id) {
        return Optional.ofNullable(trucks.get(id));
    }

    public void updateTruck(FuelTruck truck) {
        trucks.put(truck.getId(), truck);
    }

    public void preloadTrucks(List<FuelTruck> list) {
        for (FuelTruck truck : list) {
            trucks.put(truck.getId(), truck);
        }
    }
}