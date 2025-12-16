package com.reservation.notification.repository;

import com.reservation.notification.entite.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUtilisateurId(Long utilisateurId);

    List<Notification> findByStatut(Notification.StatutNotification statut);
}
