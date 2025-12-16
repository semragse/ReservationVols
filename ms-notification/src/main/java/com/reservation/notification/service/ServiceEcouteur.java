package com.reservation.notification.service;

import com.reservation.notification.dto.MessageReservation;
import com.reservation.notification.entite.Notification;
import com.reservation.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServiceEcouteur {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    @RabbitListener(queues = "queue.notification")
    public void recevoirMessageReservation(MessageReservation message) {
        log.info("Message reçu pour la réservation: {}", message.getNumeroReservation());

        try {
            // Créer la notification
            Notification notification = new Notification();
            notification.setUtilisateurId(message.getUtilisateurId());
            notification.setDestinataire(message.getEmailUtilisateur());
            notification.setType(Notification.TypeNotification.EMAIL);
            
            if ("CONFIRMEE".equals(message.getStatut())) {
                notification.setSujet("Confirmation de réservation - " + message.getNumeroReservation());
                notification.setMessage(String.format(
                    "Votre réservation %s a été confirmée avec succès.\n\nType: %s\n\nMerci de votre confiance!",
                    message.getNumeroReservation(),
                    message.getTypeReservation()
                ));
            } else if ("ANNULEE".equals(message.getStatut())) {
                notification.setSujet("Annulation de réservation - " + message.getNumeroReservation());
                notification.setMessage(String.format(
                    "Votre réservation %s a été annulée.\n\nType: %s",
                    message.getNumeroReservation(),
                    message.getTypeReservation()
                ));
            }

            // Envoyer l'email
            envoyerEmail(notification);

            notification.setStatut(Notification.StatutNotification.ENVOYEE);
            notification.setDateEnvoi(LocalDateTime.now());
            
            notificationRepository.save(notification);
            log.info("Notification envoyée avec succès à: {}", message.getEmailUtilisateur());

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de la notification", e);
            
            Notification notificationEchec = new Notification();
            notificationEchec.setUtilisateurId(message.getUtilisateurId());
            notificationEchec.setDestinataire(message.getEmailUtilisateur());
            notificationEchec.setStatut(Notification.StatutNotification.ECHEC);
            notificationRepository.save(notificationEchec);
        }
    }

    private void envoyerEmail(Notification notification) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(notification.getDestinataire());
        message.setSubject(notification.getSujet());
        message.setText(notification.getMessage());
        message.setFrom("noreply@reservation-voyages.com");

        // mailSender.send(message); // Décommenter pour l'envoi réel
        log.info("Email simulé envoyé à: {}", notification.getDestinataire());
    }
}
