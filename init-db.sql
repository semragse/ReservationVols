-- Script d'initialisation des bases de données MySQL
-- Exécuté automatiquement par Docker lors du premier démarrage de MySQL

CREATE DATABASE IF NOT EXISTS db_utilisateur;
CREATE DATABASE IF NOT EXISTS db_vol;
CREATE DATABASE IF NOT EXISTS db_hotel;
CREATE DATABASE IF NOT EXISTS db_reservation;
CREATE DATABASE IF NOT EXISTS db_notification;

-- Afficher les bases créées
SHOW DATABASES;
