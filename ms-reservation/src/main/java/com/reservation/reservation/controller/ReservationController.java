package com.reservation.reservation.controller;

import com.reservation.reservation.entite.Reservation;
import com.reservation.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Slf4j
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<Reservation>> obtenirToutesReservations() {
        List<Reservation> reservations = reservationService.obtenirToutesReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> obtenirReservationParId(@PathVariable Long id) {
        return reservationService.obtenirReservationParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<Reservation>> obtenirReservationsParUtilisateur(@PathVariable Long utilisateurId) {
        List<Reservation> reservations = reservationService.obtenirReservationsParUtilisateur(utilisateurId);
        return ResponseEntity.ok(reservations);
    }

    @PostMapping
    public ResponseEntity<Reservation> creerReservation(@RequestBody Reservation reservation) {
        Reservation nouvelleReservation = reservationService.creerReservation(reservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(nouvelleReservation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> modifierReservation(@PathVariable Long id, @RequestBody Reservation reservation) {
        return reservationService.modifierReservation(id, reservation)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/annuler")
    public ResponseEntity<Reservation> annulerReservation(@PathVariable Long id) {
        return reservationService.annulerReservation(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerReservation(@PathVariable Long id) {
        if (reservationService.supprimerReservation(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
