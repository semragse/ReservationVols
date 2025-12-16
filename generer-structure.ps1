# Script de génération des microservices restants
# MS Hotel - Structure similaire à MS Vol

Write-Host "Création du microservice Hotel..." -ForegroundColor Green

$basePathHotel = "c:\Users\sgarmes\Desktop\Sarah\ReservationVols\ms-hotel"

# Créer les répertoires
$directories = @(
    "$basePathHotel\src\main\java\com\reservation\hotel\entite",
    "$basePathHotel\src\main\java\com\reservation\hotel\dto",
    "$basePathHotel\src\main\java\com\reservation\hotel\repository",
    "$basePathHotel\src\main\java\com\reservation\hotel\service",
    "$basePathHotel\src\main\java\com\reservation\hotel\controleur",
    "$basePathHotel\src\main\java\com\reservation\hotel\config",
    "$basePathHotel\src\main\java\com\reservation\hotel\exception",
    "$basePathHotel\src\main\resources"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "Répertoires MS Hotel créés!" -ForegroundColor Yellow

Write-Host "Script terminé!" -ForegroundColor Green
