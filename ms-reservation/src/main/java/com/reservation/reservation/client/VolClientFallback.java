package com.reservation.reservation.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class VolClientFallback implements FallbackFactory<VolClient> {

    @Override
    public VolClient create(Throwable cause) {
        return new VolClient() {
            @Override
            public Boolean verifierDisponibilite(Long id, Integer nombrePlaces) {
                log.warn("Vol service unavailable for verifierDisponibilite({}, {}): {}", id, nombrePlaces, cause.getMessage());
                return false;
            }

            @Override
            public void reserverPlaces(Long id, Integer nombrePlaces) {
                log.warn("Vol service unavailable for reserverPlaces({}, {}): {}", id, nombrePlaces, cause.getMessage());
            }

            @Override
            public void libererPlaces(Long id, Integer nombrePlaces) {
                log.warn("Vol service unavailable for libererPlaces({}, {}): {}", id, nombrePlaces, cause.getMessage());
            }
        };
    }
}
