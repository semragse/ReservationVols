package com.reservation.hotel.config;

import com.reservation.hotel.entite.Hotel;
import com.reservation.hotel.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final HotelRepository hotelRepository;

    @Override
    public void run(String... args) throws Exception {
        if (hotelRepository.count() == 0) {
            log.info("Initialisation des données d'hôtels...");
            
            hotelRepository.save(createHotel("Hotel Plaza", "New York", "USA", "768 5th Ave", 
                5, new BigDecimal("450.00"), 20, "Hôtel de luxe au cœur de Manhattan"));
                
            hotelRepository.save(createHotel("Grand Tokyo Hotel", "Tokyo", "Japon", "1-1-1 Marunouchi",
                5, new BigDecimal("380.00"), 15, "Vue imprenable sur le Mont Fuji"));
                
            hotelRepository.save(createHotel("Dubai Palace", "Dubai", "UAE", "Jumeirah Beach",
                5, new BigDecimal("520.00"), 25, "Resort en bord de mer avec spa"));
                
            hotelRepository.save(createHotel("Roman Holiday Inn", "Rome", "Italie", "Via Veneto 42",
                4, new BigDecimal("220.00"), 30, "Proche du Colisée et de la fontaine de Trevi"));
                
            hotelRepository.save(createHotel("Sydney Harbour Hotel", "Sydney", "Australie", "88 George Street",
                5, new BigDecimal("400.00"), 18, "Vue sur l'opéra et le pont"));
                
            hotelRepository.save(createHotel("Riad Marrakech", "Marrakech", "Maroc", "Médina",
                4, new BigDecimal("180.00"), 12, "Riad traditionnel au cœur de la médina"));
                
            hotelRepository.save(createHotel("Buenos Aires Suites", "Buenos Aires", "Argentine", "Avenida 9 de Julio",
                4, new BigDecimal("200.00"), 22, "Hôtel moderne dans le quartier San Telmo"));
                
            hotelRepository.save(createHotel("Bangkok Paradise", "Bangkok", "Thaïlande", "Sukhumvit Road",
                4, new BigDecimal("150.00"), 28, "Piscine sur le toit avec vue panoramique"));
            
            log.info("8 hôtels ont été initialisés avec succès!");
        } else {
            log.info("Les données d'hôtels existent déjà, initialisation ignorée.");
        }
    }
    
    private Hotel createHotel(String nom, String ville, String pays, String adresse,
                             int nombreEtoiles, BigDecimal prixParNuit, int chambresDisponibles, String description) {
        Hotel hotel = new Hotel();
        hotel.setNom(nom);
        hotel.setVille(ville);
        hotel.setPays(pays);
        hotel.setAdresse(adresse);
        hotel.setNombreEtoiles(nombreEtoiles);
        hotel.setPrixParNuit(prixParNuit);
        hotel.setNombreChambres(chambresDisponibles);
        hotel.setChambresDisponibles(chambresDisponibles);
        hotel.setDescription(description);
        hotel.setStatut(Hotel.StatutHotel.ACTIF);
        return hotel;
    }
}
