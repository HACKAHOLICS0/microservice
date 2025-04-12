package com.esprit.microservice.fournisseur_back.services;

import com.esprit.microservice.fournisseur_back.entities.Supplier;
import com.esprit.microservice.fournisseur_back.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {
    @Autowired
    SupplierRepository supplierRepository;



    @Override
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public Supplier getSupplier(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    @Override
    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public Supplier updateSupplier(Long id, Supplier supplier) {
        supplier.setId(id);
        return supplierRepository.save(supplier);
    }

    @Override
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }

    @Override
    public int getTotalSuppliers() {
        return (int) supplierRepository.count();
    }

    @Override
    public Map<String, Long> getProductCountPerSupplier() {
        return supplierRepository.findAll().stream()
                .collect(Collectors.toMap(
                        Supplier::getNom,
                        s -> (long) s.getProducts().size()
                ));
    }

    @Override
    public Supplier getTopSupplierByProductCount() {
        return supplierRepository.findAll().stream()
                .max(Comparator.comparingInt(s -> s.getProducts().size()))
                .orElse(null);
    }

    @Override
    public double getAverageProductsPerSupplier() {
        List<Supplier> suppliers = supplierRepository.findAll();
        int totalProducts = suppliers.stream()
                .mapToInt(s -> s.getProducts().size())
                .sum();
        return suppliers.isEmpty() ? 0 : (double) totalProducts / suppliers.size();
    }

}
