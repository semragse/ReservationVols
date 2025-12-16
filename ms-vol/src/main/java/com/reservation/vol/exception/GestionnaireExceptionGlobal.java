package com.reservation.vol.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GestionnaireExceptionGlobal {

    @ExceptionHandler(RessourceNonTrouveeException.class)
    public ResponseEntity<Map<String, Object>> gererRessourceNonTrouvee(RessourceNonTrouveeException ex) {
        Map<String, Object> erreur = new HashMap<>();
        erreur.put("timestamp", LocalDateTime.now());
        erreur.put("message", ex.getMessage());
        erreur.put("status", HttpStatus.NOT_FOUND.value());
        return new ResponseEntity<>(erreur, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(VolDejaExistantException.class)
    public ResponseEntity<Map<String, Object>> gererVolDejaExistant(VolDejaExistantException ex) {
        Map<String, Object> erreur = new HashMap<>();
        erreur.put("timestamp", LocalDateTime.now());
        erreur.put("message", ex.getMessage());
        erreur.put("status", HttpStatus.CONFLICT.value());
        return new ResponseEntity<>(erreur, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> gererValidationException(MethodArgumentNotValidException ex) {
        Map<String, Object> erreur = new HashMap<>();
        erreur.put("timestamp", LocalDateTime.now());
        erreur.put("status", HttpStatus.BAD_REQUEST.value());
        
        Map<String, String> erreursValidation = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            erreursValidation.put(error.getField(), error.getDefaultMessage())
        );
        erreur.put("erreurs", erreursValidation);
        
        return new ResponseEntity<>(erreur, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> gererExceptionGenerale(Exception ex) {
        Map<String, Object> erreur = new HashMap<>();
        erreur.put("timestamp", LocalDateTime.now());
        erreur.put("message", "Une erreur interne s'est produite");
        erreur.put("details", ex.getMessage());
        erreur.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(erreur, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
