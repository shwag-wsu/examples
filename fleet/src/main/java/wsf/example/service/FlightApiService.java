package wsf.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(FlightApiService.class);

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${aviationstack.api.key}")
    private String API_KEY;

    public List<Flight> fetchArrivals(String airportIataCode, Airport airport) {

        String url = String.format("http://api.aviationstack.com/v1/flights?access_key=%s&arr_iata=%s&flight_status=active&limit=25", API_KEY, airportIataCode);

        logger.info("Fetching flight arrivals for airport [{}]", airportIataCode);

        Map response = restTemplate.getForObject(url, Map.class);
        List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");

        List<Flight> flights = new ArrayList<>();

        if (data == null) {
            logger.warn("No flight data received for airport [{}]", airportIataCode);
            return flights;
        }

        for (Map<String, Object> entry : data) {
            Map<String, Object> flightMap = (Map<String, Object>) entry.get("flight");
            Map<String, Object> airlineMap = (Map<String, Object>) entry.get("airline");
            Map<String, Object> arrivalMap = (Map<String, Object>) entry.get("arrival");
            Map<String, Object> liveMap = (Map<String, Object>) entry.get("live");
            Map<String, Object> aircraftMap = (Map<String, Object>) entry.get("aircraft");

            String flightNumber = (String) flightMap.get("iata");
            String airline = (String) airlineMap.get("name");
            String airline_iata = (String) airlineMap.get("iata");
            String status = (String) entry.get("flight_status");
            String arrivalTimeRaw = (String) arrivalMap.get("scheduled");
            String registration = aircraftMap != null ? (String) aircraftMap.get("registration") : "N/A";
            Double latitude = liveMap != null ? (Double) liveMap.get("latitude") : null;
            Double longitude = liveMap != null ? (Double) liveMap.get("longitude") : null;

            if (arrivalTimeRaw == null) {
                logger.debug("Skipping flight [{}]: no scheduled arrival time [{}]", flightNumber, arrivalMap.get("scheduled"));
                continue;
            }

            if (latitude == null || longitude == null) {
                logger.debug("Skipping flight [{}]: missing live coordinates", flightNumber);
                continue;
            }

            LocalDateTime arrivalTime = LocalDateTime.parse(arrivalTimeRaw.substring(0, 19));

            Flight flight = new Flight();
            flight.setFlightNumber(flightNumber);
            flight.setAirline(airline);
            flight.setAirline_iata(airline_iata);
            flight.setStatus(status);
            flight.setArrivalTime(arrivalTime);
            flight.setAirport(airport);
            flight.setRegistration(registration);
            flight.setLatitude(latitude);
            flight.setLongitude(longitude);

            logger.debug("Fetched flight [{}] arriving at [{}]", flightNumber, arrivalTime);
            flights.add(flight);
        }

        logger.info("Fetched [{}] valid flights for airport [{}]", flights.size(), airportIataCode);
        return flights;
    }
}