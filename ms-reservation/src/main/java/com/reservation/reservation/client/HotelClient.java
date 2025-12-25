package com.reservation.reservation.client;

import org.springframework.cloud.openfeign.FeignClient;
import com.reservation.reservation.client.HotelClientFallback;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ms-hotel", fallbackFactory = HotelClientFallback.class)
public interface HotelClient {

    @GetMapping("/api/hotels/{id}/disponibilite")
    Boolean verifierDisponibilite(@PathVariable("id") Long id, 
                                  @RequestParam("nombreChambres") Integer nombreChambres);

    @PostMapping("/api/hotels/{id}/reserver")
    void reserverChambres(@PathVariable("id") Long id, 
                         @RequestParam("nombreChambres") Integer nombreChambres);

    @PostMapping("/api/hotels/{id}/liberer")
    void libererChambres(@PathVariable("id") Long id, 
                        @RequestParam("nombreChambres") Integer nombreChambres);
}
