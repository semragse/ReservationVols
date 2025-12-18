package com.reservation.utilisateur.services;

import com.reservation.utilisateur.dto.CreationUtilisateurDto;
import com.reservation.utilisateur.dto.UtilisateurDto;
import com.reservation.utilisateur.entities.Utilisateur;
import com.reservation.utilisateur.exception.RessourceNonTrouveeException;
import com.reservation.utilisateur.exception.UtilisateurDejaExistantException;
import com.reservation.utilisateur.repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UtilisateurDto creerUtilisateur(CreationUtilisateurDto dto) {
        if (utilisateurRepository.existsByEmail(dto.getEmail())) {
            throw new UtilisateurDejaExistantException("Un utilisateur avec cet email existe déjà");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setTelephone(dto.getTelephone());
        utilisateur.setRole(Utilisateur.Role.USER);
        utilisateur.setActif(true);

        Utilisateur utilisateurSauvegarde = utilisateurRepository.save(utilisateur);
        return convertirEnDto(utilisateurSauvegarde);
    }

    @Transactional(readOnly = true)
    public UtilisateurDto obtenirUtilisateurParId(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Utilisateur non trouvé avec l'id: " + id));
        return convertirEnDto(utilisateur);
    }

    @Transactional(readOnly = true)
    public UtilisateurDto obtenirUtilisateurParEmail(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RessourceNonTrouveeException("Utilisateur non trouvé avec l'email: " + email));
        return convertirEnDto(utilisateur);
    }

    @Transactional(readOnly = true)
    public List<UtilisateurDto> obtenirTousLesUtilisateurs() {
        return utilisateurRepository.findAll().stream()
                .map(this::convertirEnDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UtilisateurDto mettreAJourUtilisateur(Long id, CreationUtilisateurDto dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RessourceNonTrouveeException("Utilisateur non trouvé avec l'id: " + id));

        if (!utilisateur.getEmail().equals(dto.getEmail()) && 
            utilisateurRepository.existsByEmail(dto.getEmail())) {
            throw new UtilisateurDejaExistantException("Un utilisateur avec cet email existe déjà");
        }

        utilisateur.setEmail(dto.getEmail());
        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isEmpty()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        }
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setTelephone(dto.getTelephone());

        Utilisateur utilisateurMisAJour = utilisateurRepository.save(utilisateur);
        return convertirEnDto(utilisateurMisAJour);
    }

    @Transactional
    public void supprimerUtilisateur(Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new RessourceNonTrouveeException("Utilisateur non trouvé avec l'id: " + id);
        }
        utilisateurRepository.deleteById(id);
    }

    private UtilisateurDto convertirEnDto(Utilisateur utilisateur) {
        UtilisateurDto dto = new UtilisateurDto();
        dto.setId(utilisateur.getId());
        dto.setEmail(utilisateur.getEmail());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setTelephone(utilisateur.getTelephone());
        dto.setRole(utilisateur.getRole());
        dto.setActif(utilisateur.getActif());
        dto.setDateCreation(utilisateur.getDateCreation());
        dto.setDateModification(utilisateur.getDateModification());
        return dto;
    }
}
