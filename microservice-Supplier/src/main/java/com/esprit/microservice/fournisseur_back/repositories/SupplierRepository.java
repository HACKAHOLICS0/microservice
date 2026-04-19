package com.esprit.microservice.fournisseur_back.repositories;

import com.esprit.microservice.fournisseur_back.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
