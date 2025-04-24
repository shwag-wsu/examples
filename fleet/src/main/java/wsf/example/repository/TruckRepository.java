package wsf.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import wsf.example.model.Truck;

@Repository
public interface TruckRepository extends JpaRepository<Truck, Long> {}