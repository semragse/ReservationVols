package com.reservation.vol.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreationVolDto {

    @NotBlank(message = "Le numéro de vol est obligatoire")
    private String numeroVol;

    @NotBlank(message = "La compagnie est obligatoire")
    private String compagnie;

    @NotBlank(message = "La ville de départ est obligatoire")
    private String villeDepart;

    @NotBlank(message = "La ville d'arrivée est obligatoire")
    private String villeArrivee;

    @NotNull(message = "La date de départ est obligatoire")
    @Future(message = "La date de départ doit être dans le futur")
    private LocalDateTime dateDepart;

    @NotNull(message = "La date d'arrivée est obligatoire")
    @Future(message = "La date d'arrivée doit être dans le futur")
    private LocalDateTime dateArrivee;

    @NotNull(message = "Le nombre de places est obligatoire")
    @Min(value = 1, message = "Le nombre de places doit être au moins 1")
    private Integer nombrePlaces;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix doit être supérieur à 0")
    private BigDecimal prix;
}
