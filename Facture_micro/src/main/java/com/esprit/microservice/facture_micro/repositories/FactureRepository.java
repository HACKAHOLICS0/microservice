package com.esprit.microservice.facture_micro.repositories;

import com.esprit.microservice.facture_micro.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
}
