package com.esprit.microservice.produitcategorie.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.esprit.microservice.produitcategorie.entities.Produit;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {


}
