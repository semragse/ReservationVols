package com.reservation.reservation.client;

import com.reservation.reservation.client.dto.UtilisateurDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-utilisateur", fallbackFactory = UtilisateurClientFallback.class)
public interface UtilisateurClient {

    @GetMapping("/api/utilisateurs/{id}")
    UtilisateurDto obtenirUtilisateurParId(@PathVariable("id") Long id);

    @GetMapping("/api/utilisateurs/email/{email}")
    UtilisateurDto obtenirUtilisateurParEmail(@PathVariable("email") String email);
}
