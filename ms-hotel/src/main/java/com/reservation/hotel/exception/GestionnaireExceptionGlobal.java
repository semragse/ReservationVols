package com.reservation.hotel.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
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
        Map<String, Object> reponse = new HashMap<>();
        reponse.put("timestamp", LocalDateTime.now());
        reponse.put("message", ex.getMessage());
        reponse.put("status", HttpStatus.NOT_FOUND.value());
        return new ResponseEntity<>(reponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(HotelDejaExistantException.class)
    public ResponseEntity<Map<String, Object>> gererHotelDejaExistant(HotelDejaExistantException ex) {
        Map<String, Object> reponse = new HashMap<>();
        reponse.put("timestamp", LocalDateTime.now());
        reponse.put("message", ex.getMessage());
        reponse.put("status", HttpStatus.CONFLICT.value());
        return new ResponseEntity<>(reponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> gererArgumentIllegal(IllegalArgumentException ex) {
        Map<String, Object> reponse = new HashMap<>();
        reponse.put("timestamp", LocalDateTime.now());
        reponse.put("message", ex.getMessage());
        reponse.put("status", HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(reponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> gererValidation(MethodArgumentNotValidException ex) {
        Map<String, String> erreurs = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String nomChamp = ((FieldError) error).getField();
            String messageErreur = error.getDefaultMessage();
            erreurs.put(nomChamp, messageErreur);
        });

        Map<String, Object> reponse = new HashMap<>();
        reponse.put("timestamp", LocalDateTime.now());
        reponse.put("erreurs", erreurs);
        reponse.put("status", HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(reponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> gererExceptionGenerique(Exception ex) {
        Map<String, Object> reponse = new HashMap<>();
        reponse.put("timestamp", LocalDateTime.now());
        reponse.put("message", "Une erreur interne est survenue");
        reponse.put("details", ex.getMessage());
        reponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(reponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
