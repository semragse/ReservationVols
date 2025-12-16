# Guide de Démarrage - Plateforme de Réservation de Voyages

## Architecture du Projet

L'application est composée de **8 microservices** et **1 frontend Angular** :

### Microservices Infrastructure
1. **ms-serveur-config** (Port 8888) - Configuration centralisée
2. **ms-serveur-eureka** (Port 8761) - Service Discovery
3. **ms-passerelle** (Port 8080) - API Gateway

### Microservices Métier
4. **ms-utilisateur** (Port 8081) - Gestion des utilisateurs
5. **ms-vol** (Port 8082) - Gestion des vols
6. **ms-hotel** (Port 8083) - Gestion des hôtels
7. **ms-reservation** (Port 8084) - Gestion des réservations (avec Circuit Breaker et Spring Batch)
8. **ms-notification** (Port 8085) - Notifications asynchrones (avec RabbitMQ)

### Frontend
9. **frontend-angular** (Port 4200) - Interface utilisateur

---

## Prérequis

### Logiciels requis
- ✅ Java 17 ou supérieur
- ✅ Maven 3.8+
- ✅ PostgreSQL 13+
- ✅ RabbitMQ 3.12+
- ✅ Node.js 18+ et npm
- ✅ Angular CLI 17+

### Vérification des prérequis

```powershell
# Vérifier Java
java -version

# Vérifier Maven
mvn -version

# Vérifier PostgreSQL
psql --version

# Vérifier Node.js et npm
node --version
npm --version

# Installer Angular CLI si nécessaire
npm install -g @angular/cli
```

---

## Configuration des Bases de Données

### 1. Créer les bases de données PostgreSQL

```sql
-- Connectez-vous à PostgreSQL
psql -U postgres

-- Créer les bases de données
CREATE DATABASE db_utilisateur;
CREATE DATABASE db_vol;
CREATE DATABASE db_hotel;
CREATE DATABASE db_reservation;
CREATE DATABASE db_notification;

-- Vérifier
\l
```

### 2. Configuration RabbitMQ

RabbitMQ utilise les paramètres par défaut :
- Host: localhost
- Port: 5672
- Username: guest
- Password: guest

Accès au management UI : http://localhost:15672

---

## Démarrage de l'Application

### ORDRE IMPORTANT : Démarrer les services dans cet ordre

#### Étape 1 : Config Server (PREMIER)

```powershell
cd ms-serveur-config
mvn clean install
mvn spring-boot:run
```

Vérifier : http://localhost:8888/actuator/health

#### Étape 2 : Eureka Server (DEUXIÈME)

```powershell
cd ms-serveur-eureka
mvn clean install
mvn spring-boot:run
```

Vérifier : http://localhost:8761

#### Étape 3 : Gateway (TROISIÈME)

```powershell
cd ms-passerelle
mvn clean install
mvn spring-boot:run
```

Vérifier : http://localhost:8080/actuator/health

#### Étape 4 : Microservices Métier (PARALLÈLE)

Ouvrez **5 terminaux PowerShell** séparés :

**Terminal 1 - MS Utilisateur :**
```powershell
cd ms-utilisateur
mvn clean install
mvn spring-boot:run
```

**Terminal 2 - MS Vol :**
```powershell
cd ms-vol
mvn clean install
mvn spring-boot:run
```

**Terminal 3 - MS Hotel :**
```powershell
cd ms-hotel
mvn clean install
mvn spring-boot:run
```

**Terminal 4 - MS Reservation :**
```powershell
cd ms-reservation
mvn clean install
mvn spring-boot:run
```

**Terminal 5 - MS Notification :**
```powershell
cd ms-notification
mvn clean install
mvn spring-boot:run
```

#### Étape 5 : Frontend Angular

```powershell
cd frontend-angular
npm install
ng serve
```

Accéder à l'application : http://localhost:4200

---

## Vérification des Services

### Dashboard Eureka
http://localhost:8761

Vous devriez voir 6 services enregistrés :
- MS-UTILISATEUR
- MS-VOL
- MS-HOTEL
- MS-RESERVATION
- MS-NOTIFICATION
- PASSERELLE

### Endpoints API (via Gateway)

**Utilisateurs :**
```
GET    http://localhost:8080/api/utilisateurs
POST   http://localhost:8080/api/utilisateurs
GET    http://localhost:8080/api/utilisateurs/{id}
```

**Vols :**
```
GET    http://localhost:8080/api/vols
POST   http://localhost:8080/api/vols
GET    http://localhost:8080/api/vols/{id}
GET    http://localhost:8080/api/vols/recherche?villeDepart=Paris&villeArrivee=NewYork&dateDebut=...&dateFin=...
```

**Hotels :**
```
GET    http://localhost:8080/api/hotels
POST   http://localhost:8080/api/hotels
GET    http://localhost:8080/api/hotels/{id}
```

**Réservations :**
```
GET    http://localhost:8080/api/reservations
POST   http://localhost:8080/api/reservations
GET    http://localhost:8080/api/reservations/{id}
```

---

## Fonctionnalités Clés Implémentées

### ✅ Circuit Breaker (Resilience4J) - MS Reservation
- Configuration dans `application.properties`
- Health check disponible : http://localhost:8084/actuator/health
- Métriques : http://localhost:8084/actuator/circuitbreakers

### ✅ Spring Batch - MS Reservation
- Job de suppression des réservations expirées
- Planification : Chaque dimanche à minuit (cron: 0 0 0 * * SUN)
- Configuration dans `ConfigurationBatch.java`

### ✅ Communication Asynchrone - RabbitMQ
- Queue : `queue.notification`
- Exchange : `exchange.reservation`
- Routing Key : `reservation.confirmation`
- MS Notification écoute les messages de confirmation

### ✅ OpenFeign - Communication Synchrone
- MS Reservation utilise OpenFeign pour appeler MS Vol et MS Hotel
- Clients Feign : `VolClient.java`, `HotelClient.java`

---

## Tests avec Postman / curl

### Créer un utilisateur
```powershell
curl -X POST http://localhost:8080/api/utilisateurs `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "motDePasse": "password123",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "0612345678"
  }'
```

### Créer un vol
```powershell
curl -X POST http://localhost:8080/api/vols `
  -H "Content-Type: application/json" `
  -d '{
    "numeroVol": "AF123",
    "compagnie": "Air France",
    "villeDepart": "Paris",
    "villeArrivee": "New York",
    "dateDepart": "2025-12-20T10:00:00",
    "dateArrivee": "2025-12-20T18:00:00",
    "nombrePlaces": 150,
    "prix": 450.00
  }'
```

---

## Dépannage

### Problème : Service ne démarre pas
**Solution :** Vérifier que PostgreSQL est démarré et que les bases de données existent

### Problème : Eureka n'affiche pas les services
**Solution :** Attendre 30 secondes (temps d'enregistrement) ou redémarrer les services

### Problème : Erreur de connexion RabbitMQ
**Solution :** 
```powershell
# Windows : Installer RabbitMQ via Chocolatey
choco install rabbitmq

# Démarrer le service
rabbitmq-service start
```

### Problème : Port déjà utilisé
**Solution :** Modifier le port dans `application.properties` du microservice concerné

---

## Commandes Utiles

### Compiler tous les microservices
```powershell
mvn clean install
```

### Nettoyer et recompiler
```powershell
mvn clean package
```

### Voir les logs d'un service
Les logs s'affichent dans le terminal où le service a été démarré

### Arrêter un service
`Ctrl + C` dans le terminal du service

---

## Architecture des Packages

Chaque microservice suit cette structure :

```
ms-[nom]/
├── src/main/java/com/reservation/[nom]/
│   ├── entite/          # Entités JPA (ID en Long)
│   ├── dto/             # Data Transfer Objects
│   ├── repository/      # Repositories Spring Data
│   ├── service/         # Logique métier
│   ├── controleur/      # REST Controllers
│   ├── config/          # Configuration (Security, etc.)
│   ├── exception/       # Exceptions personnalisées
│   └── [Application].java
└── src/main/resources/
    └── application.properties
```

---

## Technologies Utilisées

### Backend
- **Spring Boot 3.2.0**
- **Spring Cloud 2023.0.0**
- **Spring Security** (authentification)
- **Spring Data JPA** (persistance)
- **Spring Batch** (traitement par lot)
- **Spring Cloud Config** (configuration centralisée)
- **Eureka** (service discovery)
- **Spring Cloud Gateway** (API gateway)
- **OpenFeign** (communication synchrone)
- **Resilience4J** (circuit breaker)
- **RabbitMQ** (messaging asynchrone)
- **PostgreSQL** (base de données)
- **Lombok** (réduction du code)

### Frontend
- **Angular 17**
- **TypeScript**
- **RxJS**
- **HttpClient**

---

## Prochaines Étapes

1. ✅ Compléter les services Hotel et Reservation avec tous les endpoints CRUD
2. ✅ Implémenter l'authentification JWT complète
3. ✅ Ajouter la validation côté backend (Bean Validation)
4. ✅ Compléter le frontend Angular avec tous les formulaires
5. ✅ Ajouter des tests unitaires et d'intégration
6. ✅ Dockeriser l'application (Docker Compose)
7. ✅ Ajouter la documentation API (Swagger/OpenAPI)

---

## Support

Pour toute question ou problème, consultez les logs des services ou contactez l'équipe de développement.

**Bonne chance avec votre plateforme de réservation de voyages ! ✈️🏨**
