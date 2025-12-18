package com.reservation.reservation.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long utilisateurId;

    @Column(name = "numero_reservation", nullable = false, unique = true)
    private String numeroReservation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeReservation type;

    // Pour Vol
    private Long volId;

    // Pour Hotel
    private Long hotelId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Integer nombreChambres;

    @Column(nullable = false)
    private Integer nombrePersonnes;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montantTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReservation statut;

    @Column(name = "date_expiration")
    private LocalDateTime dateExpiration;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
        // Expiration après 24h si non confirmé
        if (statut == StatutReservation.EN_ATTENTE) {
            dateExpiration = LocalDateTime.now().plusHours(24);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }

    public enum TypeReservation {
        VOL,
        HOTEL,
        VOL_HOTEL
    }

    public enum StatutReservation {
        EN_ATTENTE,
        CONFIRMEE,
        ANNULEE,
        EXPIREE
    }
}
