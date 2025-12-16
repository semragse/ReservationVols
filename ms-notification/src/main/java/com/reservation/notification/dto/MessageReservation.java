package com.reservation.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageReservation {

    private Long reservationId;
    private Long utilisateurId;
    private String emailUtilisateur;
    private String numeroReservation;
    private String typeReservation;
    private String statut;
}
