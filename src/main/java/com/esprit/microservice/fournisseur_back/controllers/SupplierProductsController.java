package com.esprit.microservice.fournisseur_back.controllers;

import com.esprit.microservice.fournisseur_back.entities.SupplierProducts;
import com.esprit.microservice.fournisseur_back.services.SupplierProductsService;
import com.esprit.microservice.fournisseur_back.services.SupplierProductsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produit-fournisseurs")
@RequiredArgsConstructor
public class SupplierProductsController {

    @Autowired
    SupplierProductsService service;


    @PostMapping("/{fournisseurId}")
    public ResponseEntity<SupplierProducts> add(@RequestBody SupplierProducts sp, @PathVariable Long fournisseurId) {
        return ResponseEntity.ok(service.add(sp, fournisseurId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<SupplierProducts>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/by-fournisseur/{fournisseurId}")
    public ResponseEntity<List<SupplierProducts>> getByFournisseur(@PathVariable Long fournisseurId) {
        return ResponseEntity.ok(service.getByFournisseur(fournisseurId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
