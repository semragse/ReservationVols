package com.reservation.hotel.repositories;

import com.reservation.hotel.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Optional<Hotel> findByNom(String nom);

    boolean existsByNom(String nom);

    List<Hotel> findByVille(String ville);

    List<Hotel> findByPays(String pays);

    List<Hotel> findByEtoiles(Integer etoiles);

    @Query("SELECT h FROM Hotel h WHERE h.ville = :ville AND h.etoiles >= :etoilesMin")
    List<Hotel> rechercherHotelsParVilleEtEtoiles(String ville, Integer etoilesMin);

    @Query("SELECT h FROM Hotel h WHERE h.chambresDisponibles >= :nombreChambres")
    List<Hotel> rechercherHotelsDisponibles(Integer nombreChambres);
}
