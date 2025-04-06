package com.esprit.microservice.reclamation.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "reclamations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String statut; // "Ouvert", "En cours", "Résolu", "Fermé"

    @Column(nullable = false)
    private Date dateCreation;

    @Column
    private Date dateResolution;

    @Column(nullable = false)
    private String createur;
}