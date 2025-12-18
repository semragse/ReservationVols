package com.reservation.hotel.controllers;

import com.reservation.hotel.dto.CreationHotelDto;
import com.reservation.hotel.dto.HotelDto;
import com.reservation.hotel.services.HotelService;
import com.reservation.hotel.services.ServiceConversionDevise;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelControleur {

    private final HotelService hotelService;
    private final ServiceConversionDevise serviceConversionDevise;

    @PostMapping
    public ResponseEntity<HotelDto> creerHotel(@Valid @RequestBody CreationHotelDto dto) {
        HotelDto hotel = hotelService.creerHotel(dto);
        return new ResponseEntity<>(hotel, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDto> obtenirHotel(@PathVariable Long id) {
        HotelDto hotel = hotelService.obtenirHotelParId(id);
        return ResponseEntity.ok(hotel);
    }

    @GetMapping("/nom/{nom}")
    public ResponseEntity<HotelDto> obtenirHotelParNom(@PathVariable String nom) {
        HotelDto hotel = hotelService.obtenirHotelParNom(nom);
        return ResponseEntity.ok(hotel);
    }

    @GetMapping
    public ResponseEntity<List<HotelDto>> obtenirTousLesHotels() {
        List<HotelDto> hotels = hotelService.obtenirTousLesHotels();
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/ville/{ville}")
    public ResponseEntity<List<HotelDto>> rechercherHotelsParVille(@PathVariable String ville) {
        List<HotelDto> hotels = hotelService.rechercherHotelsParVille(ville);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/pays/{pays}")
    public ResponseEntity<List<HotelDto>> rechercherHotelsParPays(@PathVariable String pays) {
        List<HotelDto> hotels = hotelService.rechercherHotelsParPays(pays);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/etoiles/{etoiles}")
    public ResponseEntity<List<HotelDto>> rechercherHotelsParEtoiles(@PathVariable Integer etoiles) {
        List<HotelDto> hotels = hotelService.rechercherHotelsParEtoiles(etoiles);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<HotelDto>> rechercherHotelsDisponibles(@RequestParam Integer nombreChambres) {
        List<HotelDto> hotels = hotelService.rechercherHotelsDisponibles(nombreChambres);
        return ResponseEntity.ok(hotels);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HotelDto> mettreAJourHotel(
            @PathVariable Long id,
            @Valid @RequestBody CreationHotelDto dto) {
        HotelDto hotel = hotelService.mettreAJourHotel(id, dto);
        return ResponseEntity.ok(hotel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerHotel(@PathVariable Long id) {
        hotelService.supprimerHotel(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/disponibilite")
    public ResponseEntity<Boolean> verifierDisponibilite(
            @PathVariable Long id,
            @RequestParam Integer nombreChambres) {
        boolean disponible = hotelService.verifierDisponibilite(id, nombreChambres);
        return ResponseEntity.ok(disponible);
    }

    @PostMapping("/{id}/reserver")
    public ResponseEntity<Void> reserverChambres(
            @PathVariable Long id,
            @RequestParam Integer nombreChambres) {
        hotelService.reserverChambres(id, nombreChambres);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/liberer")
    public ResponseEntity<Void> libererChambres(
            @PathVariable Long id,
            @RequestParam Integer nombreChambres) {
        hotelService.libererChambres(id, nombreChambres);
        return ResponseEntity.ok().build();
    }

    /**
     * Convertit le prix d'un hôtel en Dirham marocain
     */
    @GetMapping("/{id}/prix-dirham")
    public ResponseEntity<Map<String, Object>> obtenirPrixEnDirham(@PathVariable Long id) {
        HotelDto hotel = hotelService.obtenirHotelParId(id);
        BigDecimal prixDirham = serviceConversionDevise.convertirEuroVersDirham(hotel.getPrixParNuit());
        
        Map<String, Object> response = new HashMap<>();
        response.put("hotelId", hotel.getId());
        response.put("nomHotel", hotel.getNom());
        response.put("prixParNuitEuros", hotel.getPrixParNuit());
        response.put("prixParNuitDirhams", prixDirham);
        response.put("tauxConversion", serviceConversionDevise.obtenirTauxEurVersMad());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Convertit un montant en euros vers dirhams marocains
     */
    @GetMapping("/conversion/euro-vers-dirham")
    public ResponseEntity<Map<String, Object>> convertirEuroVersDirham(@RequestParam BigDecimal montant) {
        BigDecimal montantDirham = serviceConversionDevise.convertirEuroVersDirham(montant);
        
        Map<String, Object> response = new HashMap<>();
        response.put("montantEuros", montant);
        response.put("montantDirhams", montantDirham);
        response.put("tauxConversion", serviceConversionDevise.obtenirTauxEurVersMad());
        
        return ResponseEntity.ok(response);
    }
}
