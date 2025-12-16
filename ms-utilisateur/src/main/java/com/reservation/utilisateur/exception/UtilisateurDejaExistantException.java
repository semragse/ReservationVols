package com.reservation.utilisateur.exception;

public class UtilisateurDejaExistantException extends RuntimeException {

    public UtilisateurDejaExistantException(String message) {
        super(message);
    }
}
