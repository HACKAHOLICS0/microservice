package com.esprit.microservice.produitcategorie.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.esprit.microservice.produitcategorie.entities.CategorieProduit;
import org.springframework.stereotype.Repository;

@Repository
public interface CategorieProduitRepository extends JpaRepository<CategorieProduit, Long> {

}
