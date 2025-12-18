package com.reservation.utilisateur.controllers;

import com.reservation.utilisateur.dto.CreationUtilisateurDto;
import com.reservation.utilisateur.dto.UtilisateurDto;
import com.reservation.utilisateur.services.UtilisateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurControleur {

    private final UtilisateurService utilisateurService;

    @PostMapping
    public ResponseEntity<UtilisateurDto> creerUtilisateur(@Valid @RequestBody CreationUtilisateurDto dto) {
        UtilisateurDto utilisateur = utilisateurService.creerUtilisateur(dto);
        return new ResponseEntity<>(utilisateur, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurDto> obtenirUtilisateur(@PathVariable Long id) {
        UtilisateurDto utilisateur = utilisateurService.obtenirUtilisateurParId(id);
        return ResponseEntity.ok(utilisateur);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UtilisateurDto> obtenirUtilisateurParEmail(@PathVariable String email) {
        UtilisateurDto utilisateur = utilisateurService.obtenirUtilisateurParEmail(email);
        return ResponseEntity.ok(utilisateur);
    }

    @GetMapping
    public ResponseEntity<List<UtilisateurDto>> obtenirTousLesUtilisateurs() {
        List<UtilisateurDto> utilisateurs = utilisateurService.obtenirTousLesUtilisateurs();
        return ResponseEntity.ok(utilisateurs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurDto> mettreAJourUtilisateur(
            @PathVariable Long id,
            @Valid @RequestBody CreationUtilisateurDto dto) {
        UtilisateurDto utilisateur = utilisateurService.mettreAJourUtilisateur(id, dto);
        return ResponseEntity.ok(utilisateur);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable Long id) {
        utilisateurService.supprimerUtilisateur(id);
        return ResponseEntity.noContent().build();
    }
}
