package com.esprit.microservice.reclamation.repositories;

import com.esprit.microservice.reclamation.entities.Reclamation;
import com.esprit.microservice.reclamation.entities.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByCreateur(String createur);
    List<Reclamation> findByStatut(String statut);
}