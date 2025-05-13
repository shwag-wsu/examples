package wsf.example.service;

import org.springframework.stereotype.Service;
import wsf.example.model.Truck;
import wsf.example.repository.TruckRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TruckService {

    private final TruckRepository truckRepository;

    public TruckService(TruckRepository truckRepository) {
        this.truckRepository = truckRepository;
    }

    public List<Truck> getAllTrucks() {
        return truckRepository.findAll();
    }

    public Optional<Truck> getTruckById(Long id) {
        return truckRepository.findById(id);
    }

    public Truck findNearestAvailableTruck(double lat, double lon) {
        List<Truck> trucks = getAllTrucks(); // Or inject from repository if preferred
    
        Truck nearest = null;
        double minDistance = Double.MAX_VALUE;
    
        for (Truck truck : trucks) {
            if (truck.getStatus() != Truck.TruckStatus.AVAILABLE) continue;
    
            double dx = truck.getLatitude() - lat;
            double dy = truck.getLongitude() - lon;
            double distance = Math.sqrt(dx * dx + dy * dy); // rough distance in degrees
    
            if (distance < minDistance) {
                minDistance = distance;
                nearest = truck;
            }
        }
    
        return nearest;
    }

    public Truck saveAirport(Truck truck) {
        return truckRepository.save(truck);
    }

    public void deleteTruck(Long id) {
        truckRepository.deleteById(id);
    }
    
}