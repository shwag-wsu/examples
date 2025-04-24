# 🚛 Fleet Management Backend

A Spring Boot application that provides RESTful APIs and real-time Server-Sent Events (SSE) for managing a fleet of trucks and fuel stations across various states.

---

## 📋 Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Real-Time Alerts](#real-time-alerts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- **Fleet Management**: Monitor a fleet of trucks in real time.
- **Station Management**: Track fuel depots across various states.
- **Real-Time Alerts**: Receive live alerts via Server-Sent Events (SSE).
- **RESTful APIs**: Clean, structured REST endpoints.
- **Modular Architecture**: Organized services, models, and controllers.

---

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shwag-wsu/examples.git
   cd examples

2. **Navigate to the backend**

   ```bash
   cd fleet-backend

3. **Build the application**

   ```bash
   mvn clean install


4. **Run the server**

   ```bash
    java -jar target/fleet-backend-0.0.1-SNAPSHOT.jar

The server runs at http://localhost:8080.


## 🔔 Real-Time Alerts
Subscribe to alerts using Server-Sent Events (SSE):

SSE Endpoint
GET /api/alerts/stream

```java
const eventSource = new EventSource('/api/alerts/stream');

eventSource.addEventListener("alert", (e) => {
  const alert = JSON.parse(e.data);
  console.log('New alert:', alert.message);
});

## 🚀 Deployment
### Environment Variables

SERVER_PORT — Port for the app (default: 8080)

SPRING_PROFILES_ACTIVE — Active Spring profiles

Example (Custom Port)

``` bash
java -jar -Dserver.port=9090 target/fleet-backend-0.0.1-SNAPSHOT.jar


## 🤝 Contributing
### Fork the project

1. **Create** a new branch (git checkout -b feature/new-feature)

Commit changes (git commit -am 'Add new feature')

Push to the branch (git push origin feature/new-feature)

Create a Pull Request

