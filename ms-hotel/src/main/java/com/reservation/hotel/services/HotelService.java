package com.reservation.hotel.services;

import com.reservation.hotel.dto.CreationHotelDto;
import com.reservation.hotel.dto.HotelDto;
import com.reservation.hotel.entities.Hotel;
import com.reservation.hotel.exception.HotelDejaExistantException;
import com.reservation.hotel.exception.RessourceNonTrouveeException;
import com.reservation.hotel.repositories.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    @Transactional
    public HotelDto creerHotel(CreationHotelDto dto) {
        if (hotelRepository.existsByNom(dto.getNom())) {
            throw new HotelDejaExistantException("Un hôtel avec ce nom existe déjà");
        }

        Hotel hotel = new Hotel();
        hotel.setNom(dto.getNom());
        hotel.setAdresse(dto.getAdresse());
        hotel.setVille(dto.getVille());
        hotel.setPays(dto.getPays());
        hotel.setEtoiles(dto.getEtoiles());
        hotel.setDescription(dto.getDescription());
        hotel.setNombreChambres(dto.getNombreChambres());
        hotel.setChambresDisponibles(dto.getNombreChambres());
        hotel.setPrixParNuit(dto.getPrixParNuit());
        hotel.setTelephone(dto.getTelephone());
        hotel.setEmail(dto.getEmail());

        Hotel hotelSauvegarde = hotelRepository.save(hotel);
        return convertirEnDto(hotelSauvegarde);
    }

    @Transactional(readOnly = true)
    public HotelDto obtenirHotelParId(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Hôtel non trouvé avec l'id: " + id));
        return convertirEnDto(hotel);
    }

    @Transactional(readOnly = true)
    public HotelDto obtenirHotelParNom(String nom) {
        Hotel hotel = hotelRepository.findByNom(nom)
                .orElseThrow(() -> new RessourceNonTrouveeException("Hôtel non trouvé avec le nom: " + nom));
        return convertirEnDto(hotel);
    }

    @Transactional(readOnly = true)
    public List<HotelDto> obtenirTousLesHotels() {
        return hotelRepository.findAll().stream()
                .map(this::convertirEnDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HotelDto> rechercherHotelsParVille(String ville) {
        return hotelRepository.findByVille(ville).stream()
                .map(this::convertirEnDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HotelDto> rechercherHotelsParPays(String pays) {
        return hotelRepository.findByPays(pays).stream()
                .map(this::convertirEnDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HotelDto> rechercherHotelsParEtoiles(Integer etoiles) {
        return hotelRepository.findByEtoiles(etoiles).stream()
                .map(this::convertirEnDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HotelDto> rechercherHotelsDisponibles(Integer nombreChambres) {
        return hotelRepository.rechercherHotelsDisponibles(nombreChambres).stream()
                .map(this::convertirEnDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public HotelDto mettreAJourHotel(Long id, CreationHotelDto dto) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Hôtel non trouvé avec l'id: " + id));

        if (!hotel.getNom().equals(dto.getNom()) && hotelRepository.existsByNom(dto.getNom())) {
            throw new HotelDejaExistantException("Un hôtel avec ce nom existe déjà");
        }

        hotel.setNom(dto.getNom());
        hotel.setAdresse(dto.getAdresse());
        hotel.setVille(dto.getVille());
        hotel.setPays(dto.getPays());
        hotel.setEtoiles(dto.getEtoiles());
        hotel.setDescription(dto.getDescription());
        hotel.setNombreChambres(dto.getNombreChambres());
        hotel.setPrixParNuit(dto.getPrixParNuit());
        hotel.setTelephone(dto.getTelephone());
        hotel.setEmail(dto.getEmail());

        Hotel hotelMisAJour = hotelRepository.save(hotel);
        return convertirEnDto(hotelMisAJour);
    }

    @Transactional
    public void supprimerHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new RessourceNonTrouveeException("Hôtel non trouvé avec l'id: " + id);
        }
        hotelRepository.deleteById(id);
    }

    @Transactional
    public boolean verifierDisponibilite(Long id, Integer nombreChambres) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Hôtel non trouvé avec l'id: " + id));
        return hotel.getChambresDisponibles() >= nombreChambres;
    }

    @Transactional
    public void reserverChambres(Long id, Integer nombreChambres) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Hôtel non trouvé avec l'id: " + id));
        
        if (hotel.getChambresDisponibles() < nombreChambres) {
            throw new IllegalArgumentException("Pas assez de chambres disponibles");
        }

        hotel.setChambresDisponibles(hotel.getChambresDisponibles() - nombreChambres);
        hotelRepository.save(hotel);
    }

    @Transactional
    public void libererChambres(Long id, Integer nombreChambres) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Hôtel non trouvé avec l'id: " + id));

        hotel.setChambresDisponibles(hotel.getChambresDisponibles() + nombreChambres);
        if (hotel.getChambresDisponibles() > hotel.getNombreChambres()) {
            hotel.setChambresDisponibles(hotel.getNombreChambres());
        }
        hotelRepository.save(hotel);
    }

    private HotelDto convertirEnDto(Hotel hotel) {
        HotelDto dto = new HotelDto();
        dto.setId(hotel.getId());
        dto.setNom(hotel.getNom());
        dto.setAdresse(hotel.getAdresse());
        dto.setVille(hotel.getVille());
        dto.setPays(hotel.getPays());
        dto.setEtoiles(hotel.getEtoiles());
        dto.setDescription(hotel.getDescription());
        dto.setNombreChambres(hotel.getNombreChambres());
        dto.setChambresDisponibles(hotel.getChambresDisponibles());
        dto.setPrixParNuit(hotel.getPrixParNuit());
        dto.setTelephone(hotel.getTelephone());
        dto.setEmail(hotel.getEmail());
        dto.setDateCreation(hotel.getDateCreation());
        dto.setDateModification(hotel.getDateModification());
        return dto;
    }
}
