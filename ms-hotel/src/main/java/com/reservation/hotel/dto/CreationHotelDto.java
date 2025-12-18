package com.reservation.hotel.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreationHotelDto {
    
    @NotBlank(message = "Le nom de l'hôtel est obligatoire")
    private String nom;
    
    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;
    
    @NotBlank(message = "La ville est obligatoire")
    private String ville;
    
    @NotBlank(message = "Le pays est obligatoire")
    private String pays;
    
    @NotNull(message = "Le nombre d'étoiles est obligatoire")
    @Min(value = 1, message = "Le nombre d'étoiles minimum est 1")
    @Max(value = 5, message = "Le nombre d'étoiles maximum est 5")
    private Integer etoiles;
    
    private String description;
    
    @NotNull(message = "Le nombre de chambres est obligatoire")
    @Min(value = 1, message = "Le nombre de chambres doit être au moins 1")
    private Integer nombreChambres;
    
    @NotNull(message = "Le prix par nuit est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix doit être supérieur à 0")
    private BigDecimal prixParNuit;
    
    @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Format de téléphone invalide")
    private String telephone;
    
    @Email(message = "Format d'email invalide")
    private String email;
}
