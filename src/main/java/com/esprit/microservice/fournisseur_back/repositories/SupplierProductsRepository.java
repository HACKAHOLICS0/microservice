package com.esprit.microservice.fournisseur_back.repositories;

import com.esprit.microservice.fournisseur_back.entities.SupplierProducts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierProductsRepository extends JpaRepository<SupplierProducts, Long> {

    List<SupplierProducts> findBySupplierId(Long supplierId);

}
