# Plateforme de Réservation de Voyages

Plateforme de réservation de voyages basée sur une architecture microservices avec Spring Cloud et Angular.

## Architecture

### Microservices
- **ms-serveur-config** : Serveur de configuration centralisée
- **ms-serveur-eureka** : Service de découverte (Eureka Server)
- **ms-passerelle** : API Gateway (point d'entrée unique)
- **ms-utilisateur** : Gestion des utilisateurs
- **ms-vol** : Gestion des vols
- **ms-hotel** : Gestion des hôtels
- **ms-reservation** : Gestion des réservations (avec Circuit Breaker et Spring Batch)
- **ms-notification** : Service de notification asynchrone

### Frontend
- **frontend-angular** : Interface utilisateur Angular

## Technologies Utilisées

### Backend
- Spring Boot 3.2.0
- Spring Cloud 2023.0.0
- Spring Security
- Spring Data JPA
- PostgreSQL
- Lombok
- OpenFeign (communication synchrone)
- Resilience4J (Circuit Breaker)
- Spring Batch (traitement par lot)
- RabbitMQ (communication asynchrone)

### Frontend
- Angular

## Prérequis
- Java 17
- Maven 3.8+
- PostgreSQL
- RabbitMQ
- Node.js et npm (pour Angular)

## Démarrage

### 1. Démarrer les services d'infrastructure (dans l'ordre)
```bash
# Config Server
cd ms-serveur-config
mvn spring-boot:run

# Eureka Server
cd ms-serveur-eureka
mvn spring-boot:run

# Gateway
cd ms-passerelle
mvn spring-boot:run
```

### 2. Démarrer les microservices métier
```bash
cd ms-utilisateur && mvn spring-boot:run
cd ms-vol && mvn spring-boot:run
cd ms-hotel && mvn spring-boot:run
cd ms-reservation && mvn spring-boot:run
cd ms-notification && mvn spring-boot:run
```

### 3. Démarrer le frontend
```bash
cd frontend-angular
npm install
ng serve
```

## Ports par défaut
- Config Server: 8888
- Eureka Server: 8761
- Gateway: 8080
- MS Utilisateur: 8081
- MS Vol: 8082
- MS Hotel: 8083
- MS Reservation: 8084
- MS Notification: 8085
- Frontend Angular: 4200

## Base de données
Chaque microservice possède sa propre base de données PostgreSQL.
