package com.esprit.microservice.fournisseur_back.services;

import com.esprit.microservice.fournisseur_back.entities.SupplierProducts;

import java.util.List;

public interface SupplierProductsService {
    SupplierProducts add(SupplierProducts sp, Long fournisseurId);

    List<SupplierProducts> getAll();
    List<SupplierProducts> getByFournisseurId(Long id);
    SupplierProducts add(SupplierProducts sp);
    SupplierProducts update(Long id, SupplierProducts sp);

    List<SupplierProducts> getByFournisseur(Long fournisseurId);

    void delete(Long id);
}
