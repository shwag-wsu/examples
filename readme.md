# 🚀 Examples: Showcasing My Coding Projects

Welcome to the **Examples** repository! This collection highlights various coding projects I've developed, demonstrating my skills in full-stack development, system design, and user interface creation. Each project within this repository serves as a testament to my ability to build scalable and efficient applications.

---

## 📄 Project Overview

This repository contains a sample full-stack application consisting of a Java-based backend and a modern React-based frontend. It is designed to demonstrate best practices in service-oriented architecture, real-time data flow, and user-centric interfaces.

The project is modular, organized for easy extensibility and maintainability. It includes clear patterns for communication between services, state management, and event-driven updates using Server-Sent Events (SSE).

---

## 💼 Use Case

Imagine a fleet management system where a dispatcher monitors and interacts with real-time vehicle data. This application showcases:

- Real-time updates on vehicle positions or statuses.
- A responsive UI for managing and tracking fleet resources.
- Backend logic for handling vehicle states and pushing updates to clients.

  
This example is ideal for demonstrating how one might build enterprise-ready systems that combine real-time backend services with dynamic frontend dashboards.

---

## 📁 Repository Structure

- `fleet/`: Backend service handling business logic and data persistence. [fleet](./fleet/)
- `fleet-ui/`: Frontend application for user interaction with live data.

---

## 🛠️ Technologies Used

### Backend
- Java 21
- Spring Boot
- Maven
- SQLite
- Server-Sent Events (SSE)

### Frontend
- React.js
- Redux
- Tailwind CSS

### DevOps & Tooling
- Docker & Docker Compose
- Jest & React Testing Library

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/shwag-wsu/examples.git
   cd examples

2. **Set up the frontend**
   ```bash
   cd ../fleet-ui
   npm install
   npm start

3. **Optional Deploy to backend**
   ```bash
   cd ../fleet-ui
   npm run build
   mv dist ../fleet/src/main/resources

This option will package the font-end with the backend to run as one jar.

4. **Start up the backend**

   ```bash
  cd fleet
  mvn install
  mvn spring-boot:run

## 🤝 Contributing
Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.