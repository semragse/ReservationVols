package com.reservation.vol.controleur;

import com.reservation.vol.dto.CreationVolDto;
import com.reservation.vol.dto.VolDto;
import com.reservation.vol.service.VolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vols")
@RequiredArgsConstructor
public class VolControleur {

    private final VolService volService;

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
}
