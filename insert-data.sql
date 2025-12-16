-- Script d'insertion de données de test

-- Connexion à la base de données des vols
\c db_vol;

-- Insertion de vols
INSERT INTO vols (numero_vol, compagnie, ville_depart, ville_arrivee, date_depart, date_arrivee, prix, places_disponibles) VALUES
('AF123', 'Air France', 'Paris', 'New York', '2025-12-20 08:00:00', '2025-12-20 20:00:00', 850.00, 50),
('AF456', 'Air France', 'Paris', 'Tokyo', '2025-12-22 10:30:00', '2025-12-23 08:00:00', 1200.00, 30),
('BA789', 'British Airways', 'Londres', 'Dubai', '2025-12-21 14:00:00', '2025-12-22 01:00:00', 650.00, 40),
('LH234', 'Lufthansa', 'Berlin', 'Rome', '2025-12-23 09:00:00', '2025-12-23 11:30:00', 250.00, 60),
('EK567', 'Emirates', 'Dubai', 'Sydney', '2025-12-25 22:00:00', '2025-12-26 16:00:00', 1500.00, 25),
('AF789', 'Air France', 'Paris', 'Marrakech', '2025-12-24 07:00:00', '2025-12-24 10:00:00', 350.00, 45),
('IB345', 'Iberia', 'Madrid', 'Buenos Aires', '2025-12-27 18:00:00', '2025-12-28 06:00:00', 950.00, 35),
('KL678', 'KLM', 'Amsterdam', 'Bangkok', '2025-12-26 11:00:00', '2025-12-27 05:00:00', 800.00, 40);

-- Connexion à la base de données des hôtels
\c db_hotel;

-- Insertion d'hôtels
INSERT INTO hotels (nom, ville, pays, adresse, nombre_etoiles, prix_par_nuit, chambres_disponibles, description) VALUES
('Hotel Plaza', 'New York', 'USA', '768 5th Ave', 5, 450.00, 20, 'Hôtel de luxe au cœur de Manhattan'),
('Grand Tokyo Hotel', 'Tokyo', 'Japon', '1-1-1 Marunouchi', 5, 380.00, 15, 'Vue imprenable sur le Mont Fuji'),
('Dubai Palace', 'Dubai', 'UAE', 'Jumeirah Beach', 5, 520.00, 25, 'Resort en bord de mer avec spa'),
('Roman Holiday Inn', 'Rome', 'Italie', 'Via Veneto 42', 4, 220.00, 30, 'Proche du Colisée et de la fontaine de Trevi'),
('Sydney Harbour Hotel', 'Sydney', 'Australie', '88 George Street', 5, 400.00, 18, 'Vue sur l''opéra et le pont'),
('Riad Marrakech', 'Marrakech', 'Maroc', 'Médina', 4, 180.00, 12, 'Riad traditionnel au cœur de la médina'),
('Buenos Aires Suites', 'Buenos Aires', 'Argentine', 'Avenida 9 de Julio', 4, 200.00, 22, 'Hôtel moderne dans le quartier San Telmo'),
('Bangkok Paradise', 'Bangkok', 'Thaïlande', 'Sukhumvit Road', 4, 150.00, 28, 'Piscine sur le toit avec vue panoramique');

-- Connexion à la base de données des utilisateurs
\c db_utilisateur;

-- Insertion d'utilisateurs (mot de passe: "password" hashé avec BCrypt)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, telephone, date_creation, role) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '$2a$10$XQYq3M4XW8q9W8q9W8q9W.', '+33612345678', NOW(), 'USER'),
('Martin', 'Sophie', 'sophie.martin@email.com', '$2a$10$XQYq3M4XW8q9W8q9W8q9W.', '+33687654321', NOW(), 'USER'),
('Bernard', 'Pierre', 'pierre.bernard@email.com', '$2a$10$XQYq3M4XW8q9W8q9W8q9W.', '+33698765432', NOW(), 'USER'),
('Admin', 'System', 'admin@reservation.com', '$2a$10$XQYq3M4XW8q9W8q9W8q9W.', '+33600000000', NOW(), 'ADMIN');

