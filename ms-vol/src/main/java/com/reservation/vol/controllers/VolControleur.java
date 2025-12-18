package com.reservation.vol.controllers;

import com.reservation.vol.dto.CreationVolDto;
import com.reservation.vol.dto.VolDto;
import com.reservation.vol.service.ServiceConversionDevise;
import com.reservation.vol.service.VolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vols")
@RequiredArgsConstructor
public class VolControleur {

    private final VolService volService;
    private final ServiceConversionDevise serviceConversionDevise;

    @PostMapping
    public ResponseEntity<VolDto> creerVol(@Valid @RequestBody CreationVolDto dto) {
        VolDto vol = volService.creerVol(dto);
        return new ResponseEntity<>(vol, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VolDto> obtenirVol(@PathVariable Long id) {
        VolDto vol = volService.obtenirVolParId(id);
        return ResponseEntity.ok(vol);
    }

    @GetMapping("/numero/{numeroVol}")
    public ResponseEntity<VolDto> obtenirVolParNumero(@PathVariable String numeroVol) {
        VolDto vol = volService.obtenirVolParNumero(numeroVol);
        return ResponseEntity.ok(vol);
    }

    @GetMapping
    public ResponseEntity<List<VolDto>> obtenirTousLesVols() {
        List<VolDto> vols = volService.obtenirTousLesVols();
        return ResponseEntity.ok(vols);
    }

    @GetMapping("/recherche")
    public ResponseEntity<List<VolDto>> rechercherVols(
            @RequestParam String villeDepart,
            @RequestParam String villeArrivee,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        List<VolDto> vols = volService.rechercherVols(villeDepart, villeArrivee, dateDebut, dateFin);
        return ResponseEntity.ok(vols);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VolDto> mettreAJourVol(
            @PathVariable Long id,
            @Valid @RequestBody CreationVolDto dto) {
        VolDto vol = volService.mettreAJourVol(id, dto);
        return ResponseEntity.ok(vol);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerVol(@PathVariable Long id) {
        volService.supprimerVol(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/disponibilite")
    public ResponseEntity<Boolean> verifierDisponibilite(
            @PathVariable Long id,
            @RequestParam Integer nombrePlaces) {
        boolean disponible = volService.verifierDisponibilite(id, nombrePlaces);
        return ResponseEntity.ok(disponible);
    }

    @PostMapping("/{id}/reserver")
    public ResponseEntity<Void> reserverPlaces(
            @PathVariable Long id,
            @RequestParam Integer nombrePlaces) {
        volService.reserverPlaces(id, nombrePlaces);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/liberer")
    public ResponseEntity<Void> libererPlaces(
            @PathVariable Long id,
            @RequestParam Integer nombrePlaces) {
        volService.libererPlaces(id, nombrePlaces);
        return ResponseEntity.ok().build();
    }

    /**
     * Convertit le prix d'un vol en Dirham marocain
     */
    @GetMapping("/{id}/prix-dirham")
    public ResponseEntity<Map<String, Object>> obtenirPrixEnDirham(@PathVariable Long id) {
        VolDto vol = volService.obtenirVolParId(id);
        BigDecimal prixDirham = serviceConversionDevise.convertirEuroVersDirham(vol.getPrix());
        
        Map<String, Object> response = new HashMap<>();
        response.put("volId", vol.getId());
        response.put("numeroVol", vol.getNumeroVol());
        response.put("prixEuros", vol.getPrix());
        response.put("prixDirhams", prixDirham);
        response.put("tauxConversion", serviceConversionDevise.obtenirTauxEurVersMad());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Convertit un montant en euros vers dirhams marocains
     */
    @GetMapping("/conversion/euro-vers-dirham")
    public ResponseEntity<Map<String, Object>> convertirEuroVersDirham(
            @RequestParam BigDecimal montant) {
        BigDecimal montantDirham = serviceConversionDevise.convertirEuroVersDirham(montant);
        
        Map<String, Object> response = new HashMap<>();
        response.put("montantEuros", montant);
        response.put("montantDirhams", montantDirham);
        response.put("tauxConversion", serviceConversionDevise.obtenirTauxEurVersMad());
        
        return ResponseEntity.ok(response);
    }
}
