package com.reservation.reservation.services;

import com.reservation.reservation.entities.Reservation;
import com.reservation.reservation.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;

    @Transactional(readOnly = true)
    public List<Reservation> obtenirToutesReservations() {
        log.info("Récupération de toutes les réservations");
        return reservationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Reservation> obtenirReservationParId(Long id) {
        log.info("Récupération de la réservation avec l'id: {}", id);
        return reservationRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Reservation> obtenirReservationsParUtilisateur(Long utilisateurId) {
        log.info("Récupération des réservations pour l'utilisateur: {}", utilisateurId);
        return reservationRepository.findByUtilisateurId(utilisateurId);
    }

    @Transactional
    public Reservation creerReservation(Reservation reservation) {
        log.info("Création d'une nouvelle réservation");
        
        // Générer un numéro de réservation unique si non fourni
        if (reservation.getNumeroReservation() == null || reservation.getNumeroReservation().isEmpty()) {
            reservation.setNumeroReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        
        return reservationRepository.save(reservation);
    }

    @Transactional
    public Optional<Reservation> modifierReservation(Long id, Reservation reservation) {
        log.info("Modification de la réservation avec l'id: {}", id);
        return reservationRepository.findById(id)
                .map(reservationExistante -> {
                    reservation.setId(id);
                    return reservationRepository.save(reservation);
                });
    }

    @Transactional
    public Optional<Reservation> annulerReservation(Long id) {
        log.info("Annulation de la réservation avec l'id: {}", id);
        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setStatut(Reservation.StatutReservation.ANNULEE);
                    return reservationRepository.save(reservation);
                });
    }

    @Transactional
    public boolean supprimerReservation(Long id) {
        log.info("Suppression de la réservation avec l'id: {}", id);
        if (reservationRepository.existsById(id)) {
            reservationRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
