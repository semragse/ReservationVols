package com.reservation.reservation.batch;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PlanificateurBatch {

    private final JobLauncher jobLauncher;
    private final Job jobSuppressionReservationsExpirees;

    // Exécution chaque semaine (dimanche à minuit)
    @Scheduled(cron = "0 0 0 * * SUN")
    public void executerSuppressionReservationsExpirees() {
        try {
            log.info("Démarrage du job de suppression des réservations expirées");
            JobParameters params = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(jobSuppressionReservationsExpirees, params);
            log.info("Job de suppression des réservations expirées terminé");
        } catch (Exception e) {
            log.error("Erreur lors de l'exécution du job", e);
        }
    }
}
