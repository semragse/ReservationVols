package com.reservation.reservation.client;

import com.reservation.reservation.client.dto.UtilisateurDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class UtilisateurClientFallback implements FallbackFactory<UtilisateurClient> {

    @Override
    public UtilisateurClient create(Throwable cause) {
        return new UtilisateurClient() {
            @Override
            public UtilisateurDto obtenirUtilisateurParId(Long id) {
                log.warn("Utilisateur service unavailable for obtenirUtilisateurParId({}): {}", id, cause.getMessage());
                return null;
            }

            @Override
            public UtilisateurDto obtenirUtilisateurParEmail(String email) {
                log.warn("Utilisateur service unavailable for obtenirUtilisateurParEmail({}): {}", email, cause.getMessage());
                return null;
            }
        };
    }
}
