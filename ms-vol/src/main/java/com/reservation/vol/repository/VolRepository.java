package com.reservation.vol.repository;

import com.reservation.vol.entities.Vol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VolRepository extends JpaRepository<Vol, Long> {

    Optional<Vol> findByNumeroVol(String numeroVol);

    List<Vol> findByVilleDepartAndVilleArrivee(String villeDepart, String villeArrivee);

    @Query("SELECT v FROM Vol v WHERE v.dateDepart BETWEEN :dateDebut AND :dateFin")
    List<Vol> findByDateDepartBetween(LocalDateTime dateDebut, LocalDateTime dateFin);

    @Query("SELECT v FROM Vol v WHERE v.villeDepart = :villeDepart AND v.villeArrivee = :villeArrivee " +
           "AND v.dateDepart BETWEEN :dateDebut AND :dateFin AND v.placesDisponibles > 0")
    List<Vol> rechercherVols(String villeDepart, String villeArrivee, 
                            LocalDateTime dateDebut, LocalDateTime dateFin);

    boolean existsByNumeroVol(String numeroVol);
}
