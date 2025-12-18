package com.reservation.reservation.config;

import com.reservation.reservation.entities.Reservation;
import com.reservation.reservation.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ReservationRepository reservationRepository;

    @Override
    public void run(String... args) {
        if (reservationRepository.count() == 0) {
            log.info("Initialisation des données de test pour les réservations...");

            // Réservation de vol pour utilisateur 1 (Jean Dupont)
            Reservation resVol1 = new Reservation();
            resVol1.setUtilisateurId(1L);
            resVol1.setNumeroReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            resVol1.setType(Reservation.TypeReservation.VOL);
            resVol1.setVolId(1L); // Vol AF123 Paris-New York
            resVol1.setNombrePersonnes(2);
            resVol1.setMontantTotal(new BigDecimal("1700.00")); // 2 x 850€
            resVol1.setStatut(Reservation.StatutReservation.CONFIRMEE);

            // Réservation d'hôtel pour utilisateur 1 (Jean Dupont)
            Reservation resHotel1 = new Reservation();
            resHotel1.setUtilisateurId(1L);
            resHotel1.setNumeroReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            resHotel1.setType(Reservation.TypeReservation.HOTEL);
            resHotel1.setHotelId(1L); // Hotel Plaza Paris
            resHotel1.setDateDebut(LocalDate.now().plusDays(15));
            resHotel1.setDateFin(LocalDate.now().plusDays(20));
            resHotel1.setNombreChambres(1);
            resHotel1.setNombrePersonnes(2);
            resHotel1.setMontantTotal(new BigDecimal("750.00")); // 5 nuits x 150€
            resHotel1.setStatut(Reservation.StatutReservation.CONFIRMEE);

            // Réservation vol+hôtel pour utilisateur 2 (Sophie Martin)
            Reservation resCombi1 = new Reservation();
            resCombi1.setUtilisateurId(2L);
            resCombi1.setNumeroReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            resCombi1.setType(Reservation.TypeReservation.VOL_HOTEL);
            resCombi1.setVolId(2L); // Vol AF456 Paris-Tokyo
            resCombi1.setHotelId(2L); // Grand Tokyo Hotel
            resCombi1.setDateDebut(LocalDate.now().plusDays(30));
            resCombi1.setDateFin(LocalDate.now().plusDays(37));
            resCombi1.setNombreChambres(1);
            resCombi1.setNombrePersonnes(1);
            resCombi1.setMontantTotal(new BigDecimal("2600.00")); // 1200€ vol + 7*200€ hôtel
            resCombi1.setStatut(Reservation.StatutReservation.CONFIRMEE);

            // Réservation de vol pour utilisateur 3 (Pierre Bernard)
            Reservation resVol2 = new Reservation();
            resVol2.setUtilisateurId(3L);
            resVol2.setNumeroReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            resVol2.setType(Reservation.TypeReservation.VOL);
            resVol2.setVolId(6L); // Vol AF789 Paris-Marrakech
            resVol2.setNombrePersonnes(3);
            resVol2.setMontantTotal(new BigDecimal("1050.00")); // 3 x 350€
            resVol2.setStatut(Reservation.StatutReservation.CONFIRMEE);

            // Réservation d'hôtel pour utilisateur 3 (Pierre Bernard)
            Reservation resHotel2 = new Reservation();
            resHotel2.setUtilisateurId(3L);
            resHotel2.setNumeroReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            resHotel2.setType(Reservation.TypeReservation.HOTEL);
            resHotel2.setHotelId(6L); // Riad Marrakech
            resHotel2.setDateDebut(LocalDate.now().plusDays(10));
            resHotel2.setDateFin(LocalDate.now().plusDays(17));
            resHotel2.setNombreChambres(2);
            resHotel2.setNombrePersonnes(3);
            resHotel2.setMontantTotal(new BigDecimal("840.00")); // 7 nuits x 120€
            resHotel2.setStatut(Reservation.StatutReservation.CONFIRMEE);

            // Réservation en attente pour utilisateur 2 (Sophie Martin)
            Reservation resAttente = new Reservation();
            resAttente.setUtilisateurId(2L);
            resAttente.setNumeroReservation("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            resAttente.setType(Reservation.TypeReservation.VOL);
            resAttente.setVolId(4L); // Vol LH234 Berlin-Rome
            resAttente.setNombrePersonnes(1);
            resAttente.setMontantTotal(new BigDecimal("250.00"));
            resAttente.setStatut(Reservation.StatutReservation.EN_ATTENTE);

            reservationRepository.save(resVol1);
            reservationRepository.save(resHotel1);
            reservationRepository.save(resCombi1);
            reservationRepository.save(resVol2);
            reservationRepository.save(resHotel2);
            reservationRepository.save(resAttente);

            log.info("6 réservations de test créées avec succès!");
        } else {
            log.info("Les données de réservations existent déjà.");
        }
    }
}
