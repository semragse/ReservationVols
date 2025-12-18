package com.reservation.reservation.batch;

import com.reservation.reservation.entities.Reservation;
import com.reservation.reservation.repositories.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.data.RepositoryItemReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ConfigurationBatch {

    private final ReservationRepository reservationRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;

    @Bean
    public RepositoryItemReader<Reservation> lecteurReservationsExpirees() {
        RepositoryItemReader<Reservation> reader = new RepositoryItemReader<>();
        reader.setRepository(reservationRepository);
        reader.setMethodName("findByStatutAndDateExpirationBefore");
        reader.setArguments(java.util.Arrays.asList(
            Reservation.StatutReservation.EN_ATTENTE,
            LocalDateTime.now()
        ));
        reader.setPageSize(10);
        reader.setSort(Map.of("id", Sort.Direction.ASC));
        return reader;
    }

    @Bean
    public ItemProcessor<Reservation, Reservation> processeurReservationsExpirees() {
        return reservation -> {
            log.info("Traitement réservation expirée: {}", reservation.getNumeroReservation());
            reservation.setStatut(Reservation.StatutReservation.EXPIREE);
            return reservation;
        };
    }

    @Bean
    public ItemWriter<Reservation> ecrivainReservationsExpirees() {
        return items -> {
            for (Reservation reservation : items) {
                log.info("Suppression réservation expirée: {}", reservation.getNumeroReservation());
                // Libérer les ressources avant suppression
                // TODO: Appeler les services Vol/Hotel pour libérer les places
                reservationRepository.delete(reservation);
            }
        };
    }

    @Bean
    public Step etapeSuppressionReservationsExpirees() {
        return new StepBuilder("etapeSuppressionReservationsExpirees", jobRepository)
                .<Reservation, Reservation>chunk(10, transactionManager)
                .reader(lecteurReservationsExpirees())
                .processor(processeurReservationsExpirees())
                .writer(ecrivainReservationsExpirees())
                .build();
    }

    @Bean
    public Job jobSuppressionReservationsExpirees() {
        return new JobBuilder("jobSuppressionReservationsExpirees", jobRepository)
                .start(etapeSuppressionReservationsExpirees())
                .build();
    }
}
