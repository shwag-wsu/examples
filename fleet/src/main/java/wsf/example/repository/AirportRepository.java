package wsf.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import wsf.example.model.Airport;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {}