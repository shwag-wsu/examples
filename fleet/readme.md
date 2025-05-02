# ✈️ Fleet Backend Service

This backend service powers the Fleet Management application, providing RESTful APIs and real-time flight data integration. Built with Java and Spring Boot, it interfaces with the Aviationstack API to deliver up-to-date flight information to clients.

---

## 📄 Project Overview

The Fleet Backend Service is a Spring Boot application designed to handle flight data operations. It fetches real-time flight information from the Aviationstack API and exposes endpoints for frontend consumption. The service includes:

- RESTful APIs for flight data retrieval
- Integration with Aviationstack for real-time updates
- Swagger documentation for API exploration

---

## 💼 Use Case

This backend is ideal for applications requiring real-time flight tracking, such as:

- Airline operation dashboards
- Travel booking platforms
- Airport information displays

By leveraging Aviationstack, the service provides accurate and timely flight data to enhance user experience.

---

## 🛠️ Technologies Used

- **Language**: Java 21
- **Framework**: Spring Boot
- **Build Tool**: Maven
- **API Documentation**: Swagger (OpenAPI)
- **External API**: Aviationstack
- **Database**: SQLite (if applicable)
- **Access Control**: oauth2
---

## 📦 Project Structure

fleet/
├── src/
│ ├── main/
│ │ ├── java/
│ │ │ └── com/
│ │ │ └── example/
│ │ │ └── fleet/
│ │ │ ├── controller/
│ │ │ ├── service/
│ │ │ └── model/
│ │ └── resources/
│ │ └── application.properties
├── pom.xml
└── README.md


---

## 🚀 Getting Started

### Prerequisites

- Java 21
- Maven
- Aviationstack API key

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shwag-wsu/examples.git
   cd examples/fleet

2. **Configure the API key:**
   ```bash
   aviationstack.api.key=YOUR_API_KEY
   
3. **Configure oauth2:** (Cognito)
   ```bash
      spring.security.oauth2.client.registration.cognito.client-id=YOUR_CLIENT_ID
      spring.security.oauth2.client.registration.cognito.client-secret=YOUR_SECRET_KEY
      spring.security.oauth2.client.registration.cognito.client-name=Cognito
      spring.security.oauth2.client.registration.cognito.provider=cognito
      spring.security.oauth2.client.registration.cognito.scope=openid,email,profile
      spring.security.oauth2.client.registration.cognito.redirect-uri=http://localhost:8080/login/oauth2/code/cognito
4. **Build and run the application:**
   ```bash
   mvn clean install
   mvn spring-boot:run

## 📘 API Documentation
Swagger UI is available at:

http://localhost:8080/swagger-ui.html

This interface allows you to explore and test the available endpoints.

## 🔌API Endpoints

- `GET /api/flights`: Retrieve a list of current flights.
- `GET /api/flights/{id}`: Retrieve details for a specific flight.

<i>Note: Additional endpoints may be available as per the Swagger documentation.</i>

## 🔄 Real-Time Flight Data
The service integrates with the Aviationstack API to fetch real-time flight information. This includes:
- Flight status updates
- Departure and arrival times
- Airline and aircraft details
<i>Ensure your API key has sufficient privileges for the required data.</i>

## 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.