package com.reservation.vol.config;

import com.reservation.vol.entite.Vol;
import com.reservation.vol.repository.VolRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final VolRepository volRepository;

    @Override
    public void run(String... args) throws Exception {
        if (volRepository.count() == 0) {
            log.info("Initialisation des données de vols...");
            
            volRepository.save(createVol("AF123", "Air France", "Paris", "New York", 
                LocalDateTime.of(2025, 12, 20, 8, 0),
                LocalDateTime.of(2025, 12, 20, 20, 0),
                new BigDecimal("850.00"), 50));
                
            volRepository.save(createVol("AF456", "Air France", "Paris", "Tokyo",
                LocalDateTime.of(2025, 12, 22, 10, 30),
                LocalDateTime.of(2025, 12, 23, 8, 0),
                new BigDecimal("1200.00"), 30));
                
            volRepository.save(createVol("BA789", "British Airways", "Londres", "Dubai",
                LocalDateTime.of(2025, 12, 21, 14, 0),
                LocalDateTime.of(2025, 12, 22, 1, 0),
                new BigDecimal("650.00"), 40));
                
            volRepository.save(createVol("LH234", "Lufthansa", "Berlin", "Rome",
                LocalDateTime.of(2025, 12, 23, 9, 0),
                LocalDateTime.of(2025, 12, 23, 11, 30),
                new BigDecimal("250.00"), 60));
                
            volRepository.save(createVol("EK567", "Emirates", "Dubai", "Sydney",
                LocalDateTime.of(2025, 12, 25, 22, 0),
                LocalDateTime.of(2025, 12, 26, 16, 0),
                new BigDecimal("1500.00"), 25));
                
            volRepository.save(createVol("AF789", "Air France", "Paris", "Marrakech",
                LocalDateTime.of(2025, 12, 24, 7, 0),
                LocalDateTime.of(2025, 12, 24, 10, 0),
                new BigDecimal("350.00"), 45));
                
            volRepository.save(createVol("IB345", "Iberia", "Madrid", "Buenos Aires",
                LocalDateTime.of(2025, 12, 27, 18, 0),
                LocalDateTime.of(2025, 12, 28, 6, 0),
                new BigDecimal("950.00"), 35));
                
            volRepository.save(createVol("KL678", "KLM", "Amsterdam", "Bangkok",
                LocalDateTime.of(2025, 12, 26, 11, 0),
                LocalDateTime.of(2025, 12, 27, 5, 0),
                new BigDecimal("800.00"), 40));
            
            log.info("8 vols ont été initialisés avec succès!");
        } else {
            log.info("Les données de vols existent déjà, initialisation ignorée.");
        }
    }
    
    private Vol createVol(String numeroVol, String compagnie, String villeDepart, String villeArrivee,
                         LocalDateTime dateDepart, LocalDateTime dateArrivee, BigDecimal prix, int nombrePlaces) {
        Vol vol = new Vol();
        vol.setNumeroVol(numeroVol);
        vol.setCompagnie(compagnie);
        vol.setVilleDepart(villeDepart);
        vol.setVilleArrivee(villeArrivee);
        vol.setDateDepart(dateDepart);
        vol.setDateArrivee(dateArrivee);
        vol.setPrix(prix);
        vol.setNombrePlaces(nombrePlaces);
        vol.setPlacesDisponibles(nombrePlaces);
        vol.setStatut(Vol.StatutVol.PLANIFIE);
        return vol;
    }
}
