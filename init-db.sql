-- Script d'initialisation des bases de données
-- Exécuté automatiquement par Docker lors du premier démarrage de PostgreSQL

CREATE DATABASE db_utilisateur;
CREATE DATABASE db_vol;
CREATE DATABASE db_hotel;
CREATE DATABASE db_reservation;
CREATE DATABASE db_notification;

-- Afficher les bases créées
\l
