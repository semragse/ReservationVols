package com.reservation.reservation.client.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UtilisateurDto {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private String role;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
