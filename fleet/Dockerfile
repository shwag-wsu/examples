FROM amazoncorretto:21-al2023
MAINTAINER Scott Harris


EXPOSE 8083

WORKDIR /app

COPY ./target/fleet-fleet-demo.jar fleet-app.jar

CMD ["java", "-jar", "fleet-app.jar"]