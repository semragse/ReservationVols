package com.reservation.vol.service;

import com.reservation.vol.dto.CreationVolDto;
import com.reservation.vol.dto.VolDto;
import com.reservation.vol.entities.Vol;
import com.reservation.vol.exception.RessourceNonTrouveeException;
import com.reservation.vol.exception.VolDejaExistantException;
import com.reservation.vol.repository.VolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VolService {

    private final VolRepository volRepository;

    @Transactional
    public VolDto creerVol(CreationVolDto dto) {
        if (volRepository.existsByNumeroVol(dto.getNumeroVol())) {
            throw new VolDejaExistantException("Un vol avec ce numéro existe déjà");
        }

        if (dto.getDateArrivee().isBefore(dto.getDateDepart())) {
            throw new IllegalArgumentException("La date d'arrivée doit être après la date de départ");
        }

        Vol vol = new Vol();
        vol.setNumeroVol(dto.getNumeroVol());
        vol.setCompagnie(dto.getCompagnie());
        vol.setVilleDepart(dto.getVilleDepart());
        vol.setVilleArrivee(dto.getVilleArrivee());
        vol.setDateDepart(dto.getDateDepart());
        vol.setDateArrivee(dto.getDateArrivee());
        vol.setNombrePlaces(dto.getNombrePlaces());
        vol.setPlacesDisponibles(dto.getNombrePlaces());
        vol.setPrix(dto.getPrix());
        vol.setStatut(Vol.StatutVol.PLANIFIE);

        Vol volSauvegarde = volRepository.save(vol);
        return convertirEnDto(volSauvegarde);
    }

    @Transactional(readOnly = true)
    public VolDto obtenirVolParId(Long id) {
        Vol vol = volRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Vol non trouvé avec l'id: " + id));
        return convertirEnDto(vol);
    }

    @Transactional(readOnly = true)
    public VolDto obtenirVolParNumero(String numeroVol) {
        Vol vol = volRepository.findByNumeroVol(numeroVol)
                .orElseThrow(() -> new RessourceNonTrouveeException("Vol non trouvé avec le numéro: " + numeroVol));
        return convertirEnDto(vol);
    }

    @Transactional(readOnly = true)
    public List<VolDto> obtenirTousLesVols() {
        return volRepository.findAll().stream()
                .map(this::convertirEnDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VolDto> rechercherVols(String villeDepart, String villeArrivee, 
                                      LocalDateTime dateDebut, LocalDateTime dateFin) {
        return volRepository.rechercherVols(villeDepart, villeArrivee, dateDebut, dateFin).stream()
                .map(this::convertirEnDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public VolDto mettreAJourVol(Long id, CreationVolDto dto) {
        Vol vol = volRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Vol non trouvé avec l'id: " + id));

        if (!vol.getNumeroVol().equals(dto.getNumeroVol()) && 
            volRepository.existsByNumeroVol(dto.getNumeroVol())) {
            throw new VolDejaExistantException("Un vol avec ce numéro existe déjà");
        }

        if (dto.getDateArrivee().isBefore(dto.getDateDepart())) {
            throw new IllegalArgumentException("La date d'arrivée doit être après la date de départ");
        }

        vol.setNumeroVol(dto.getNumeroVol());
        vol.setCompagnie(dto.getCompagnie());
        vol.setVilleDepart(dto.getVilleDepart());
        vol.setVilleArrivee(dto.getVilleArrivee());
        vol.setDateDepart(dto.getDateDepart());
        vol.setDateArrivee(dto.getDateArrivee());
        vol.setNombrePlaces(dto.getNombrePlaces());
        vol.setPrix(dto.getPrix());

        Vol volMisAJour = volRepository.save(vol);
        return convertirEnDto(volMisAJour);
    }

    @Transactional
    public void supprimerVol(Long id) {
        if (!volRepository.existsById(id)) {
            throw new RessourceNonTrouveeException("Vol non trouvé avec l'id: " + id);
        }
        volRepository.deleteById(id);
    }

    @Transactional
    public boolean verifierDisponibilite(Long id, Integer nombrePlaces) {
        Vol vol = volRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Vol non trouvé avec l'id: " + id));
        return vol.getPlacesDisponibles() >= nombrePlaces;
    }

    @Transactional
    public void reserverPlaces(Long id, Integer nombrePlaces) {
        Vol vol = volRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Vol non trouvé avec l'id: " + id));
        
        if (vol.getPlacesDisponibles() < nombrePlaces) {
            throw new IllegalArgumentException("Pas assez de places disponibles");
        }

        vol.setPlacesDisponibles(vol.getPlacesDisponibles() - nombrePlaces);
        volRepository.save(vol);
    }

    @Transactional
    public void libererPlaces(Long id, Integer nombrePlaces) {
        Vol vol = volRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Vol non trouvé avec l'id: " + id));

        vol.setPlacesDisponibles(vol.getPlacesDisponibles() + nombrePlaces);
        if (vol.getPlacesDisponibles() > vol.getNombrePlaces()) {
            vol.setPlacesDisponibles(vol.getNombrePlaces());
        }
        volRepository.save(vol);
    }

    private VolDto convertirEnDto(Vol vol) {
        VolDto dto = new VolDto();
        dto.setId(vol.getId());
        dto.setNumeroVol(vol.getNumeroVol());
        dto.setCompagnie(vol.getCompagnie());
        dto.setVilleDepart(vol.getVilleDepart());
        dto.setVilleArrivee(vol.getVilleArrivee());
        dto.setDateDepart(vol.getDateDepart());
        dto.setDateArrivee(vol.getDateArrivee());
        dto.setNombrePlaces(vol.getNombrePlaces());
        dto.setPlacesDisponibles(vol.getPlacesDisponibles());
        dto.setPrix(vol.getPrix());
        dto.setStatut(vol.getStatut());
        dto.setDateCreation(vol.getDateCreation());
        dto.setDateModification(vol.getDateModification());
        return dto;
    }
}
