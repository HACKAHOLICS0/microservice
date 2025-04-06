package com.esprit.microservice.fournisseur_back.controllers;

import com.esprit.microservice.fournisseur_back.entities.Supplier;
import com.esprit.microservice.fournisseur_back.services.SupplierProductsServiceImpl;
import com.esprit.microservice.fournisseur_back.services.SupplierService;
import com.esprit.microservice.fournisseur_back.services.SupplierServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fournisseurs")
@RequiredArgsConstructor
public class SupplierController {
    @Autowired
    SupplierService supplierService;


    @GetMapping("/all")
    public List<Supplier> getAll() {
        return supplierService.getAllSuppliers();
    }

    @GetMapping("/{id}")
    public Supplier getById(@PathVariable Long id) {
        return supplierService.getSupplier(id);
    }

    @PostMapping("/add")
    public Supplier add(@RequestBody Supplier supplier) {
        return supplierService.addSupplier(supplier);
    }

    @PutMapping("/update/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier supplier) {
        return supplierService.updateSupplier(id, supplier);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
    }

    @GetMapping("/stats/total")
    public ResponseEntity<Integer> getTotalSuppliers() {
        return ResponseEntity.ok(supplierService.getTotalSuppliers());
    }

    @GetMapping("/stats/products-per-supplier")
    public ResponseEntity<Map<String, Long>> getProductCountPerSupplier() {
        return ResponseEntity.ok(supplierService.getProductCountPerSupplier());
    }

    @GetMapping("/stats/top-supplier")
    public ResponseEntity<Supplier> getTopSupplier() {
        return ResponseEntity.ok(supplierService.getTopSupplierByProductCount());
    }

    @GetMapping("/stats/average-products")
    public ResponseEntity<Double> getAverageProducts() {
        return ResponseEntity.ok(supplierService.getAverageProductsPerSupplier());
    }

}
