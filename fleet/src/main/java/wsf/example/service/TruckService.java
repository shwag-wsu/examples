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

    public Truck saveAirport(Truck truck) {
        return truckRepository.save(truck);
    }

    public void deleteTruck(Long id) {
        truckRepository.deleteById(id);
    }
}