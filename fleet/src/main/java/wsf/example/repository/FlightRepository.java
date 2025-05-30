package wsf.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import wsf.example.model.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
      List<Flight> findByAirport_Id(Long id);
}