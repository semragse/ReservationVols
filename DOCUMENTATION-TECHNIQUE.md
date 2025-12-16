# Documentation Complète - Architecture Microservices

## 📋 Vue d'Ensemble du Projet

Cette plateforme de réservation de voyages est basée sur une architecture microservices moderne utilisant Spring Cloud et Angular.

---

## 🏗️ Architecture Technique

### Pattern Architectural
- **Architecture**: Microservices
- **API Gateway**: Spring Cloud Gateway
- **Service Discovery**: Eureka Server
- **Configuration**: Config Server centralisé
- **Communication Synchrone**: OpenFeign
- **Communication Asynchrone**: RabbitMQ
- **Résilience**: Resilience4J (Circuit Breaker)
- **Traitement par lot**: Spring Batch

### Technologies Backend
| Technologie | Version | Utilisation |
|------------|---------|-------------|
| Spring Boot | 3.2.0 | Framework principal |
| Spring Cloud | 2023.0.0 | Microservices |
| Java | 17 | Langage |
| PostgreSQL | 15 | Base de données |
| RabbitMQ | 3.12 | Message broker |
| Lombok | Latest | Réduction code |
| Maven | 3.8+ | Build tool |

### Technologies Frontend
| Technologie | Version | Utilisation |
|------------|---------|-------------|
| Angular | 17 | Framework frontend |
| TypeScript | 5.2 | Langage |
| RxJS | 7.8 | Programmation réactive |

---

## 📦 Microservices Détaillés

### 1. MS Serveur Config (Port 8888)
**Rôle**: Centralisation des configurations

**Technologies**:
- Spring Cloud Config Server
- Git backend pour les configurations

**Endpoints**:
- `GET /actuator/health` - Health check

---

### 2. MS Serveur Eureka (Port 8761)
**Rôle**: Service Discovery

**Technologies**:
- Spring Cloud Netflix Eureka Server

**Dashboard**:
- http://localhost:8761

---

### 3. MS Passerelle (Port 8080)
**Rôle**: API Gateway - Point d'entrée unique

**Technologies**:
- Spring Cloud Gateway
- CORS configuré pour Angular

**Routes**:
```
/api/utilisateurs/** → ms-utilisateur
/api/vols/**         → ms-vol
/api/hotels/**       → ms-hotel
/api/reservations/** → ms-reservation
/api/notifications/** → ms-notification
```

---

### 4. MS Utilisateur (Port 8081)

**Responsabilités**:
- Gestion des comptes utilisateurs
- Authentification
- Autorisation (ADMIN, UTILISATEUR)

**Entité Principale**: `Utilisateur`
```java
- id: Long
- email: String (unique)
- motDePasse: String (crypté avec BCrypt)
- nom: String
- prenom: String
- telephone: String
- role: Enum (ADMIN, UTILISATEUR)
- actif: Boolean
- dateCreation: LocalDateTime
- dateModification: LocalDateTime
```

**Endpoints REST**:
```
GET    /api/utilisateurs           # Liste tous
GET    /api/utilisateurs/{id}      # Par ID
GET    /api/utilisateurs/email/{email}  # Par email
POST   /api/utilisateurs           # Créer
PUT    /api/utilisateurs/{id}      # Modifier
DELETE /api/utilisateurs/{id}      # Supprimer
```

**Packages**:
- `entite/` - Entités JPA
- `dto/` - Data Transfer Objects
- `repository/` - Spring Data JPA
- `service/` - Logique métier
- `controleur/` - REST Controllers
- `config/` - Configuration Spring Security
- `exception/` - Exceptions personnalisées

---

### 5. MS Vol (Port 8082)

**Responsabilités**:
- Gestion des vols
- Recherche de vols
- Gestion des disponibilités

**Entité Principale**: `Vol`
```java
- id: Long
- numeroVol: String (unique)
- compagnie: String
- villeDepart: String
- villeArrivee: String
- dateDepart: LocalDateTime
- dateArrivee: LocalDateTime
- nombrePlaces: Integer
- placesDisponibles: Integer
- prix: BigDecimal
- statut: Enum (PLANIFIE, EN_COURS, TERMINE, ANNULE)
- dateCreation: LocalDateTime
- dateModification: LocalDateTime
```

**Endpoints REST**:
```
GET    /api/vols                   # Liste tous
GET    /api/vols/{id}              # Par ID
GET    /api/vols/numero/{numero}   # Par numéro
GET    /api/vols/recherche         # Recherche avancée
POST   /api/vols                   # Créer
PUT    /api/vols/{id}              # Modifier
DELETE /api/vols/{id}              # Supprimer
GET    /api/vols/{id}/disponibilite # Vérifier dispo
POST   /api/vols/{id}/reserver     # Réserver places
POST   /api/vols/{id}/liberer      # Libérer places
```

**Méthodes Métier**:
- `verifierDisponibilite(Long id, Integer nombrePlaces)`
- `reserverPlaces(Long id, Integer nombrePlaces)`
- `libererPlaces(Long id, Integer nombrePlaces)`

---

### 6. MS Hotel (Port 8083)

**Responsabilités**:
- Gestion des hôtels
- Gestion des chambres

**Entité Principale**: `Hotel`
```java
- id: Long
- nom: String
- adresse: String
- ville: String
- pays: String
- etoiles: Integer
- description: String (TEXT)
- nombreChambres: Integer
- chambresDisponibles: Integer
- prixParNuit: BigDecimal
- telephone: String
- email: String
- dateCreation: LocalDateTime
- dateModification: LocalDateTime
```

**Endpoints REST**: (Structure similaire à MS Vol)

---

### 7. MS Reservation (Port 8084) ⭐

**Responsabilités**:
- Gestion des réservations
- Coordination Vol + Hotel
- Circuit Breaker pour résilience
- Spring Batch pour nettoyage

**Entité Principale**: `Reservation`
```java
- id: Long
- utilisateurId: Long
- numeroReservation: String (unique)
- type: Enum (VOL, HOTEL, VOL_HOTEL)
- volId: Long (nullable)
- hotelId: Long (nullable)
- dateDebut: LocalDate (pour hotel)
- dateFin: LocalDate (pour hotel)
- nombreChambres: Integer (pour hotel)
- nombrePersonnes: Integer
- montantTotal: BigDecimal
- statut: Enum (EN_ATTENTE, CONFIRMEE, ANNULEE, EXPIREE)
- dateExpiration: LocalDateTime
- dateCreation: LocalDateTime
- dateModification: LocalDateTime
```

**Clients Feign**:
```java
@FeignClient(name = "ms-vol")
public interface VolClient {
    Boolean verifierDisponibilite(Long id, Integer nombrePlaces);
    void reserverPlaces(Long id, Integer nombrePlaces);
    void libererPlaces(Long id, Integer nombrePlaces);
}

@FeignClient(name = "ms-hotel")
public interface HotelClient {
    Boolean verifierDisponibilite(Long id, Integer nombreChambres);
    void reserverChambres(Long id, Integer nombreChambres);
    void libererChambres(Long id, Integer nombreChambres);
}
```

**Circuit Breaker Configuration**:
```properties
resilience4j.circuitbreaker.instances.reservationService.sliding-window-size=10
resilience4j.circuitbreaker.instances.reservationService.minimum-number-of-calls=5
resilience4j.circuitbreaker.instances.reservationService.failure-rate-threshold=50
resilience4j.circuitbreaker.instances.reservationService.wait-duration-in-open-state=10s
```

**Spring Batch - Job de Nettoyage**:
- **Fréquence**: Chaque semaine (dimanche à minuit)
- **Cron**: `0 0 0 * * SUN`
- **Fonction**: Supprime les réservations avec statut EN_ATTENTE et date d'expiration dépassée

Classes Batch:
- `ConfigurationBatch.java` - Configuration du job
- `PlanificateurBatch.java` - Planification avec @Scheduled

---

### 8. MS Notification (Port 8085) ⭐

**Responsabilités**:
- Envoi de notifications asynchrones
- Écoute des événements de réservation
- Gestion des emails

**Entité Principale**: `Notification`
```java
- id: Long
- utilisateurId: Long
- destinataire: String (email)
- sujet: String
- message: String (TEXT)
- type: Enum (EMAIL, SMS, PUSH)
- statut: Enum (EN_ATTENTE, ENVOYEE, ECHEC)
- dateEnvoi: LocalDateTime
- dateCreation: LocalDateTime
```

**Configuration RabbitMQ**:
```java
Queue: queue.notification
Exchange: exchange.reservation (TopicExchange)
Routing Key: reservation.confirmation
```

**Listener RabbitMQ**:
```java
@RabbitListener(queues = "queue.notification")
public void recevoirMessageReservation(MessageReservation message) {
    // Traitement asynchrone
    // Envoi email
    // Sauvegarde notification
}
```

**DTO Message**:
```java
public class MessageReservation {
    private Long reservationId;
    private Long utilisateurId;
    private String emailUtilisateur;
    private String numeroReservation;
    private String typeReservation;
    private String statut;
}
```

---

## 🎨 Frontend Angular

### Structure des Composants

```
src/app/
├── composants/
│   ├── accueil/
│   │   └── composant-accueil.ts
│   ├── vols/
│   │   └── composant-liste-vols.ts
│   ├── hotels/
│   │   └── composant-liste-hotels.ts
│   └── reservations/
│       └── composant-reservations.ts
├── services/
│   ├── service-vol.ts
│   ├── service-hotel.ts
│   ├── service-reservation.ts
│   └── service-utilisateur.ts
├── composant-app.ts
└── module-app.ts
```

### Services HTTP

```typescript
@Injectable({ providedIn: 'root' })
export class ServiceVol {
  private urlBase = 'http://localhost:8080/api/vols';

  obtenirTousLesVols(): Observable<any[]>
  obtenirVol(id: number): Observable<any>
  rechercherVols(params): Observable<any[]>
  creerVol(vol: any): Observable<any>
}
```

### Routing

```typescript
const routes: Routes = [
  { path: '', component: ComposantAccueil },
  { path: 'vols', component: ComposantListeVols },
  { path: 'hotels', component: ComposantListeHotels },
  { path: 'reservations', component: ComposantReservations }
];
```

---

## 🔐 Sécurité

### Spring Security Configuration

Chaque microservice a une configuration Security de base :

```java
@Configuration
@EnableWebSecurity
public class ConfigurationSecurite {
    @Bean
    public SecurityFilterChain chaineSecurite(HttpSecurity http) {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        return http.build();
    }
}
```

### Encodage des Mots de Passe

```java
@Bean
public PasswordEncoder encodeurMotDePasse() {
    return new BCryptPasswordEncoder();
}
```

---

## 🗄️ Base de Données

### Schéma par Microservice

Chaque microservice a sa propre base de données (Database per Service pattern):

- `db_utilisateur` → MS Utilisateur
- `db_vol` → MS Vol
- `db_hotel` → MS Hotel
- `db_reservation` → MS Reservation
- `db_notification` → MS Notification

### Configuration JPA

```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
```

---

## 📊 Monitoring & Observabilité

### Actuator Endpoints

Tous les microservices exposent des endpoints Actuator :

```
/actuator/health       # État du service
/actuator/info         # Informations
/actuator/metrics      # Métriques
/actuator/circuitbreakers  # État des circuit breakers (MS Reservation)
```

### Health Checks

Chaque service a un health check configuré pour Docker et Kubernetes.

---

## 🚀 Déploiement

### Option 1 : Local avec PowerShell

```powershell
.\demarrer-tout.ps1
```

### Option 2 : Docker Compose

```bash
docker-compose up -d
```

### Option 3 : Manuel (ordre important)

1. Config Server
2. Eureka Server
3. Gateway
4. Microservices métier (parallèle)
5. Frontend Angular

---

## 📝 Conventions de Code

### Nommage (En Français)

- **Classes**: PascalCase (ex: `UtilisateurService`)
- **Méthodes**: camelCase (ex: `obtenirUtilisateur`)
- **Variables**: camelCase (ex: `numeroReservation`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `QUEUE_NOTIFICATION`)
- **Packages**: lowercase (ex: `com.reservation.utilisateur`)

### Types d'ID

⚠️ **Important**: Tous les IDs sont de type `Long`, jamais `int`.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;  // ✅ Correct

private Long utilisateurId;  // ✅ Correct
private Long volId;          // ✅ Correct
```

### Structure des Packages

Chaque microservice suit cette structure :

```
com.reservation.[nom]/
├── entite/           # Entités JPA
├── dto/              # Data Transfer Objects
├── repository/       # Repositories
├── service/          # Services métier
├── controleur/       # REST Controllers
├── config/           # Configurations
├── exception/        # Exceptions
└── [Nom]Application.java
```

---

## 🧪 Tests

### Tests à Implémenter

1. **Tests Unitaires**
   - Services métier
   - Validation des DTOs

2. **Tests d'Intégration**
   - Repositories JPA
   - Endpoints REST

3. **Tests End-to-End**
   - Scénarios complets de réservation

---

## 📖 Documentation API

### Swagger/OpenAPI

À ajouter dans chaque microservice :

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

Accès : `http://localhost:808X/swagger-ui.html`

---

## 🔄 Flux de Réservation Complet

### Scénario : Réservation d'un Vol

1. **Utilisateur** fait une recherche de vols via le frontend
2. **Frontend** → **Gateway** → **MS Vol** : Recherche vols disponibles
3. **Utilisateur** sélectionne un vol et confirme
4. **Frontend** → **Gateway** → **MS Reservation** : Créer réservation
5. **MS Reservation** (Circuit Breaker activé) :
   - Appel Feign → **MS Vol** : Vérifier disponibilité
   - Appel Feign → **MS Vol** : Réserver places
   - Créer réservation en BDD
   - Publier message RabbitMQ
6. **RabbitMQ** → **MS Notification** : Recevoir message
7. **MS Notification** : Envoyer email de confirmation
8. **Frontend** : Afficher confirmation

### Diagramme de Séquence

```
[Client] → [Gateway] → [MS Reservation] → [MS Vol]
                           ↓
                      [RabbitMQ]
                           ↓
                   [MS Notification]
                           ↓
                    [Email Service]
```

---

## 🛠️ Maintenance

### Logs

Les logs sont affichés dans la console de chaque service.

Pour rediriger vers un fichier :

```properties
logging.file.name=logs/application.log
logging.level.com.reservation=DEBUG
```

### Base de Données

#### Backup PostgreSQL

```bash
pg_dump -U postgres db_reservation > backup.sql
```

#### Restore

```bash
psql -U postgres db_reservation < backup.sql
```

---

## 🎯 Roadmap

### Phase 1 : Complétée ✅
- Architecture microservices
- 8 microservices fonctionnels
- Frontend Angular de base
- Circuit Breaker
- Spring Batch
- Communication asynchrone

### Phase 2 : À Faire 🔄
- [ ] Authentification JWT complète
- [ ] Tests unitaires et d'intégration
- [ ] Documentation Swagger
- [ ] Monitoring avancé (Prometheus, Grafana)
- [ ] CI/CD Pipeline

### Phase 3 : Améliorations 🚀
- [ ] Kubernetes deployment
- [ ] API Rate Limiting
- [ ] Caching (Redis)
- [ ] Elasticsearch pour recherche avancée
- [ ] WebSocket pour notifications temps réel

---

## 📚 Ressources

- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Angular Documentation](https://angular.io/docs)
- [Resilience4J](https://resilience4j.readme.io/)
- [RabbitMQ](https://www.rabbitmq.com/documentation.html)

---

**Dernière mise à jour** : Décembre 2025
