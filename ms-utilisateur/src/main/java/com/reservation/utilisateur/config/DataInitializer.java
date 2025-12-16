package com.reservation.utilisateur.config;

import com.reservation.utilisateur.entite.Utilisateur;
import com.reservation.utilisateur.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (utilisateurRepository.count() == 0) {
            log.info("Initialisation des données d'utilisateurs...");
            
            utilisateurRepository.save(createUtilisateur("Dupont", "Jean", "jean.dupont@email.com", 
                "password", "+33612345678", Utilisateur.Role.USER));
                
            utilisateurRepository.save(createUtilisateur("Martin", "Sophie", "sophie.martin@email.com",
                "password", "+33687654321", Utilisateur.Role.USER));
                
            utilisateurRepository.save(createUtilisateur("Bernard", "Pierre", "pierre.bernard@email.com",
                "password", "+33698765432", Utilisateur.Role.USER));
                
            utilisateurRepository.save(createUtilisateur("Admin", "System", "admin@reservation.com",
                "admin", "+33600000000", Utilisateur.Role.ADMIN));
            
            log.info("4 utilisateurs ont été initialisés avec succès!");
        } else {
            log.info("Les données d'utilisateurs existent déjà, initialisation ignorée.");
        }
    }
    
    private Utilisateur createUtilisateur(String nom, String prenom, String email,
                                         String motDePasse, String telephone, Utilisateur.Role role) {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(nom);
        utilisateur.setPrenom(prenom);
        utilisateur.setEmail(email);
        utilisateur.setMotDePasse(passwordEncoder.encode(motDePasse));
        utilisateur.setTelephone(telephone);
        utilisateur.setRole(role);
        utilisateur.setActif(true);
        return utilisateur;
    }
}
