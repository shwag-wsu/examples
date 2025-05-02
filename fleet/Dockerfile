FROM amazoncorretto:21-al2023
MAINTAINER Scott Harris

ENV spring_security_oauth2_client_registration_cognito_client-id=${COGNITO_CLIENT_id}
ENV spring_security_oauth2_client_registration_cognito_client-secret=${COGNITO_SECRET}


EXPOSE 8080

WORKDIR /app

COPY ./target/fleet-fleet-demo.jar fleet-app.jar

CMD ["java", "-jar", "fleet-app.jar"]