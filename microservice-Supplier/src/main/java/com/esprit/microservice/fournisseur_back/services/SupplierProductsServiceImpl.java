package com.esprit.microservice.fournisseur_back.services;

import com.esprit.microservice.fournisseur_back.entities.Supplier;
import com.esprit.microservice.fournisseur_back.entities.SupplierProducts;
import com.esprit.microservice.fournisseur_back.repositories.SupplierProductsRepository;
import com.esprit.microservice.fournisseur_back.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierProductsServiceImpl implements SupplierProductsService {

    @Autowired
    SupplierProductsRepository repository;
    @Autowired
    SupplierRepository supplierRepository;

    @Override
    public SupplierProducts add(SupplierProducts sp, Long fournisseurId) {
        Supplier supplier = supplierRepository.findById(fournisseurId)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));
        sp.setSupplier(supplier);
        return repository.save(sp);
    }

    @Override
    public List<SupplierProducts> getAll() {
        return repository.findAll();
    }

    @Override
    public List<SupplierProducts> getByFournisseurId(Long id) {
        return null;
    }

    @Override
    public SupplierProducts add(SupplierProducts sp) {
        return null;
    }

    @Override
    public SupplierProducts update(Long id, SupplierProducts sp) {
        return null;
    }

    @Override
    public List<SupplierProducts> getByFournisseur(Long fournisseurId) {
        return repository.findBySupplierId(fournisseurId);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
