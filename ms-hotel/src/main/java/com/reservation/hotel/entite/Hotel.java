package com.reservation.hotel.entite;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "hotels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    private String pays;

    @Column(nullable = false)
    private Integer etoiles;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer nombreChambres;

    @Column(nullable = false)
    private Integer chambresDisponibles;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prixParNuit;

    private String telephone;

    private String email;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
        if (chambresDisponibles == null) {
            chambresDisponibles = nombreChambres;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
