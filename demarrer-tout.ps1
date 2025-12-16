# Script de démarrage automatique de tous les microservices
# À exécuter depuis le répertoire racine du projet

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Démarrage de la Plateforme Réservation Voyages  " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$chemin_base = "c:\Users\sgarmes\Desktop\Sarah\ReservationVols"

# Fonction pour démarrer un service dans un nouveau terminal
function Demarrer-Service {
    param (
        [string]$nom,
        [string]$dossier,
        [int]$port
    )
    
    Write-Host "Démarrage de $nom sur le port $port..." -ForegroundColor Yellow
    
    $commande = "cd '$chemin_base\$dossier'; mvn spring-boot:run"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $commande
    
    Start-Sleep -Seconds 2
}

# 1. Config Server (PREMIER)
Write-Host ""
Write-Host "[1/9] Démarrage du Config Server..." -ForegroundColor Green
Demarrer-Service "Config Server" "ms-serveur-config" 8888
Write-Host "Attente de 15 secondes pour que Config Server démarre..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# 2. Eureka Server (DEUXIÈME)
Write-Host ""
Write-Host "[2/9] Démarrage d'Eureka Server..." -ForegroundColor Green
Demarrer-Service "Eureka Server" "ms-serveur-eureka" 8761
Write-Host "Attente de 15 secondes pour qu'Eureka démarre..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# 3. Gateway (TROISIÈME)
Write-Host ""
Write-Host "[3/9] Démarrage de la Gateway..." -ForegroundColor Green
Demarrer-Service "Gateway" "ms-passerelle" 8080
Write-Host "Attente de 10 secondes pour que la Gateway démarre..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# 4-8. Microservices métier (PARALLÈLE)
Write-Host ""
Write-Host "[4/9] Démarrage de MS Utilisateur..." -ForegroundColor Green
Demarrer-Service "MS Utilisateur" "ms-utilisateur" 8081

Write-Host "[5/9] Démarrage de MS Vol..." -ForegroundColor Green
Demarrer-Service "MS Vol" "ms-vol" 8082

Write-Host "[6/9] Démarrage de MS Hotel..." -ForegroundColor Green
Demarrer-Service "MS Hotel" "ms-hotel" 8083

Write-Host "[7/9] Démarrage de MS Reservation..." -ForegroundColor Green
Demarrer-Service "MS Reservation" "ms-reservation" 8084

Write-Host "[8/9] Démarrage de MS Notification..." -ForegroundColor Green
Demarrer-Service "MS Notification" "ms-notification" 8085

Write-Host ""
Write-Host "Attente de 30 secondes pour que tous les microservices démarrent..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# 9. Frontend Angular
Write-Host ""
Write-Host "[9/9] Démarrage du Frontend Angular..." -ForegroundColor Green
$commande_angular = "cd '$chemin_base\frontend-angular'; npm install; ng serve"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $commande_angular

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "  TOUS LES SERVICES SONT EN COURS DE DÉMARRAGE   " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "  - Frontend Angular:    http://localhost:4200" -ForegroundColor White
Write-Host "  - Eureka Dashboard:    http://localhost:8761" -ForegroundColor White
Write-Host "  - API Gateway:         http://localhost:8080" -ForegroundColor White
Write-Host "  - Config Server:       http://localhost:8888" -ForegroundColor White
Write-Host ""
Write-Host "Services métier (via Gateway):" -ForegroundColor Cyan
Write-Host "  - Utilisateurs:        http://localhost:8080/api/utilisateurs" -ForegroundColor White
Write-Host "  - Vols:                http://localhost:8080/api/vols" -ForegroundColor White
Write-Host "  - Hotels:              http://localhost:8080/api/hotels" -ForegroundColor White
Write-Host "  - Réservations:        http://localhost:8080/api/reservations" -ForegroundColor White
Write-Host "  - Notifications:       http://localhost:8080/api/notifications" -ForegroundColor White
Write-Host ""
Write-Host "Patientez 1-2 minutes pour que tous les services soient prêts." -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
