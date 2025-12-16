package com.reservation.reservation.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ms-vol")
public interface VolClient {

    @GetMapping("/api/vols/{id}/disponibilite")
    Boolean verifierDisponibilite(@PathVariable("id") Long id, 
                                  @RequestParam("nombrePlaces") Integer nombrePlaces);

    @PostMapping("/api/vols/{id}/reserver")
    void reserverPlaces(@PathVariable("id") Long id, 
                       @RequestParam("nombrePlaces") Integer nombrePlaces);

    @PostMapping("/api/vols/{id}/liberer")
    void libererPlaces(@PathVariable("id") Long id, 
                      @RequestParam("nombrePlaces") Integer nombrePlaces);
}
