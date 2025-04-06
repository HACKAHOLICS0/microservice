package com.esprit.microservice.reclamation.controllers;

import com.esprit.microservice.reclamation.entities.Reclamation;
import com.esprit.microservice.reclamation.services.ReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {
    @Autowired
    private ReclamationService reclamationService;

    @GetMapping
    public List<Reclamation> getAllReclamations() {
        return reclamationService.getAllReclamations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> getReclamationById(@PathVariable Long id) {
        return reclamationService.getReclamationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reclamation createReclamation(@RequestBody Reclamation reclamation) {
        return reclamationService.createReclamation(reclamation);
    }

    @PutMapping("/{id}")
    public Reclamation updateReclamation(@PathVariable Long id, @RequestBody Reclamation reclamationDetails) {
        return reclamationService.updateReclamation(id, reclamationDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReclamation(@PathVariable Long id) {
        reclamationService.deleteReclamation(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/createur/{createur}")
    public List<Reclamation> getReclamationsByCreateur(@PathVariable String createur) {
        return reclamationService.getReclamationsByCreateur(createur);
    }

    @GetMapping("/statut/{statut}")
    public List<Reclamation> getReclamationsByStatut(@PathVariable String statut) {
        return reclamationService.getReclamationsByStatut(statut);
    }
}