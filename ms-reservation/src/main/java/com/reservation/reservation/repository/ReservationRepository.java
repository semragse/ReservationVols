package com.reservation.reservation.repository;

import com.reservation.reservation.entite.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByNumeroReservation(String numeroReservation);

    List<Reservation> findByUtilisateurId(Long utilisateurId);

    List<Reservation> findByStatut(Reservation.StatutReservation statut);

    List<Reservation> findByStatutAndDateExpirationBefore(
        Reservation.StatutReservation statut, 
        LocalDateTime date
    );

    boolean existsByNumeroReservation(String numeroReservation);
}
