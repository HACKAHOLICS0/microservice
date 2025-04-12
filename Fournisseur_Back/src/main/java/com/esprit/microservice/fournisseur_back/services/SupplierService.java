package com.esprit.microservice.fournisseur_back.services;

import com.esprit.microservice.fournisseur_back.entities.Supplier;

import java.util.List;
import java.util.Map;

public interface SupplierService {
    List<Supplier> getAllSuppliers();
    Supplier getSupplier(Long id);
    Supplier addSupplier(Supplier supplier);
    Supplier updateSupplier(Long id, Supplier supplier);
    void deleteSupplier(Long id);
    int getTotalSuppliers();
    Map<String, Long> getProductCountPerSupplier();
    Supplier getTopSupplierByProductCount();
    double getAverageProductsPerSupplier();

}
