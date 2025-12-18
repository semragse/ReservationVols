package com.reservation.vol.dto;

import com.reservation.vol.entities.Vol;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VolDto {

    private Long id;
    private String numeroVol;
    private String compagnie;
    private String villeDepart;
    private String villeArrivee;
    private LocalDateTime dateDepart;
    private LocalDateTime dateArrivee;
    private Integer nombrePlaces;
    private Integer placesDisponibles;
    private BigDecimal prix;
    private Vol.StatutVol statut;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
