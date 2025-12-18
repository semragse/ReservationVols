package com.reservation.authentication.services;

import com.reservation.authentication.config.JwtUtil;
import com.reservation.authentication.dto.AuthResponse;
import com.reservation.authentication.dto.LoginRequest;
import com.reservation.authentication.dto.RegisterRequest;
import com.reservation.authentication.entities.Utilisateur;
import com.reservation.authentication.repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setTelephone(request.getTelephone());
        utilisateur.setRole(request.getRole() != null ? request.getRole() : Utilisateur.Role.USER);

        utilisateur = utilisateurRepository.save(utilisateur);

        String token = jwtUtil.generateToken(utilisateur);

        return new AuthResponse(
                token,
                utilisateur.getEmail(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getRole().name(),
                utilisateur.getId()
        );
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String token = jwtUtil.generateToken(utilisateur);

        return new AuthResponse(
                token,
                utilisateur.getEmail(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getRole().name(),
                utilisateur.getId()
        );
    }

    public boolean validateToken(String token) {
        try {
            String email = jwtUtil.extractUsername(token);
            Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            return jwtUtil.validateToken(token, utilisateur);
        } catch (Exception e) {
            return false;
        }
    }
}
