package wsf.example.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import wsf.example.model.Airport;
import wsf.example.model.Flight;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FlightApiService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${aviationstack.api.key}")
    private String API_KEY;

    public List<Flight> fetchArrivals(String airportIataCode,Airport airport) {
        String url = String.format("http://api.aviationstack.com/v1/flights?access_key=%s&arr_iata=%s&flight_status=scheduled&limit=10", API_KEY, airportIataCode);

        Map response = restTemplate.getForObject(url, Map.class);
        List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");

        List<Flight> flights = new ArrayList<>();

        for (Map<String, Object> entry : data) {
            Map<String, Object> flightMap = (Map<String, Object>) entry.get("flight");
            Map<String, Object> airlineMap = (Map<String, Object>) entry.get("airline");
            Map<String, Object> arrivalMap = (Map<String, Object>) entry.get("arrival");

            String flightNumber = (String) flightMap.get("iata");
            String airline = (String) airlineMap.get("name");
            String status = (String) entry.get("flight_status");
            String arrivalTimeRaw = (String) arrivalMap.get("estimated"); // ISO 8601 format

            LocalDateTime arrivalTime = arrivalTimeRaw != null ? LocalDateTime.parse(arrivalTimeRaw.substring(0, 19)) : null;

            Flight flight = new Flight();
            flight.setFlightNumber(flightNumber);
            flight.setAirline(airline);
            flight.setStatus(status);
            flight.setArrivalTime(arrivalTime);
            flight.setAirport(airport);
            flights.add(flight);
        }

        return flights;
    }
}