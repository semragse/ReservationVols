package com.reservation.vol.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Service de conversion des devises
 * Taux de conversion: 1 EUR = 10.80 MAD (Dirham marocain)
 */
@Service
public class ServiceConversionDevise {

    private static final BigDecimal TAUX_EUR_VERS_MAD = new BigDecimal("10.80");
    private static final BigDecimal TAUX_MAD_VERS_EUR = new BigDecimal("1").divide(TAUX_EUR_VERS_MAD, 4, RoundingMode.HALF_UP);

    /**
     * Convertit des euros en dirhams marocains
     * @param montantEuros le montant en euros
     * @return le montant en dirhams marocains
     */
    public BigDecimal convertirEuroVersDirham(BigDecimal montantEuros) {
        if (montantEuros == null) {
            return BigDecimal.ZERO;
        }
        return montantEuros.multiply(TAUX_EUR_VERS_MAD).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Convertit des dirhams marocains en euros
     * @param montantDirhams le montant en dirhams marocains
     * @return le montant en euros
     */
    public BigDecimal convertirDirhamVersEuro(BigDecimal montantDirhams) {
        if (montantDirhams == null) {
            return BigDecimal.ZERO;
        }
        return montantDirhams.multiply(TAUX_MAD_VERS_EUR).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * @return le taux de conversion actuel EUR vers MAD
     */
    public BigDecimal obtenirTauxEurVersMad() {
        return TAUX_EUR_VERS_MAD;
    }
}
