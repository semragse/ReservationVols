package com.reservation.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelDto {
    private Long id;
    private String nom;
    private String adresse;
    private String ville;
    private String pays;
    private Integer etoiles;
    private String description;
    private Integer nombreChambres;
    private Integer chambresDisponibles;
    private BigDecimal prixParNuit;
    private String telephone;
    private String email;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
