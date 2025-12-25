package com.reservation.reservation.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class HotelClientFallback implements FallbackFactory<HotelClient> {

    @Override
    public HotelClient create(Throwable cause) {
        return new HotelClient() {
            @Override
            public Boolean verifierDisponibilite(Long id, Integer nombreChambres) {
                log.warn("Hotel service unavailable for verifierDisponibilite({}, {}): {}", id, nombreChambres, cause.getMessage());
                return false;
            }

            @Override
            public void reserverChambres(Long id, Integer nombreChambres) {
                log.warn("Hotel service unavailable for reserverChambres({}, {}): {}", id, nombreChambres, cause.getMessage());
            }

            @Override
            public void libererChambres(Long id, Integer nombreChambres) {
                log.warn("Hotel service unavailable for libererChambres({}, {}): {}", id, nombreChambres, cause.getMessage());
            }
        };
    }
}
