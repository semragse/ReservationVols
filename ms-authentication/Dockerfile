FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
COPY target/ms-authentication-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
