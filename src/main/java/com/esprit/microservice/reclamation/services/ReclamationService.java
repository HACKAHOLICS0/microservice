package com.esprit.microservice.reclamation.services;

import com.esprit.microservice.reclamation.entities.Reclamation;
import com.esprit.microservice.reclamation.repositories.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReclamationService {
    @Autowired
    private ReclamationRepository reclamationRepository;

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    public Optional<Reclamation> getReclamationById(Long id) {
        return reclamationRepository.findById(id);
    }

    public Reclamation createReclamation(Reclamation reclamation) {
        reclamation.setDateCreation(new Date());
        reclamation.setStatut("Ouvert");
        return reclamationRepository.save(reclamation);
    }

    public Reclamation updateReclamation(Long id, Reclamation reclamationDetails) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation non trouvée avec l'id: " + id));

        reclamation.setTitre(reclamationDetails.getTitre());
        reclamation.setDescription(reclamationDetails.getDescription());
        reclamation.setStatut(reclamationDetails.getStatut());

        if ("Résolu".equals(reclamationDetails.getStatut()) || "Fermé".equals(reclamationDetails.getStatut())) {
            reclamation.setDateResolution(new Date());
        }

        return reclamationRepository.save(reclamation);
    }

    public void deleteReclamation(Long id) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation non trouvée avec l'id: " + id));

        reclamationRepository.delete(reclamation);
    }

    public List<Reclamation> getReclamationsByCreateur(String createur) {
        return reclamationRepository.findByCreateur(createur);
    }

    public List<Reclamation> getReclamationsByStatut(String statut) {
        return reclamationRepository.findByStatut(statut);
    }
}