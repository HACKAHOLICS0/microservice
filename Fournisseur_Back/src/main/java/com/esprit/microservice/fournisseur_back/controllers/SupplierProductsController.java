package com.esprit.microservice.fournisseur_back.controllers;

import com.esprit.microservice.fournisseur_back.entities.SupplierProducts;
import com.esprit.microservice.fournisseur_back.services.SupplierProductsService;
import com.esprit.microservice.fournisseur_back.services.SupplierProductsServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produit-fournisseurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupplierProductsController {

    @Autowired
    SupplierProductsService service;

    //http://localhost:8084/produit-fournisseurs/{fournisseurId}
    @Operation(summary = "Add a new supplier product")
    @PostMapping("/{fournisseurId}")
    public ResponseEntity<SupplierProducts> add(@RequestBody SupplierProducts sp, @PathVariable Long fournisseurId) {
        return ResponseEntity.ok(service.add(sp, fournisseurId));
    }

    //http://localhost:8084/produit-fournisseurs/all
    @Operation(summary = "get all suppliers products")
    @GetMapping("/all")
    public ResponseEntity<List<SupplierProducts>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }


    //http://localhost:8084/produit-fournisseurs/by-fournisseur/{fournisseurId}
    @Operation(summary = "get supplier product by supplier id")
    @GetMapping("/by-fournisseur/{fournisseurId}")
    public ResponseEntity<List<SupplierProducts>> getByFournisseur(@PathVariable Long fournisseurId) {
        return ResponseEntity.ok(service.getByFournisseur(fournisseurId));
    }

    //http://localhost:8084/produit-fournisseurs/delete/{id}
    @Operation(summary = "delete supplier product by id")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
