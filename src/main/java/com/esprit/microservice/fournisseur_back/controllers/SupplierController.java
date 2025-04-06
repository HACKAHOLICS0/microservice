package com.esprit.microservice.fournisseur_back.controllers;

import com.esprit.microservice.fournisseur_back.entities.Supplier;
import com.esprit.microservice.fournisseur_back.services.GeolocationService;
import com.esprit.microservice.fournisseur_back.services.SupplierProductsServiceImpl;
import com.esprit.microservice.fournisseur_back.services.SupplierService;
import com.esprit.microservice.fournisseur_back.services.SupplierServiceImpl;
import com.esprit.microservice.fournisseur_back.utils.CsvExporter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fournisseurs")
@RequiredArgsConstructor
public class SupplierController {
    @Autowired
    SupplierService supplierService;


    @Autowired
    private GeolocationService geolocationService;

    @GetMapping("/geolocate/{id}")
    public Mono<ResponseEntity<Map<String, Object>>> geolocateBySupplierId(@PathVariable Long id) {
        try {
            Supplier supplier = supplierService.getSupplier(id);

            if (supplier == null) {
                return Mono.just(ResponseEntity.status(404).body(Map.of("error", "Supplier not found")));
            }

            String address = supplier.getAdresse();
            if (address == null || address.trim().isEmpty()) {
                return Mono.just(ResponseEntity.badRequest().body(Map.of("error", "Supplier address is empty")));
            }

            return geolocationService.geocodeAddress(address)
                    .map(result -> {
                        if (result == null) {
                            return ResponseEntity.status(404).body(Map.of("error", "No result from geolocation API"));
                        }
                        return ResponseEntity.ok(result);
                    });

        } catch (Exception e) {
            e.printStackTrace(); // log dans la console
            return Mono.just(ResponseEntity.status(500).body(Map.of("error", "Internal error", "details", e.getMessage())));
        }
    }





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

    // New endpoint to export all stats to CSV
    @GetMapping("/export/all-stats")
    public ResponseEntity<String> exportAllStatsToCsv() throws IOException {
        int totalSuppliers = supplierService.getTotalSuppliers();
        Map<String, Long> productCountPerSupplier = supplierService.getProductCountPerSupplier();
        Supplier topSupplier = supplierService.getTopSupplierByProductCount();
        double averageProducts = supplierService.getAverageProductsPerSupplier();

        StringWriter writer = new StringWriter();
        CsvExporter.exportAllStatsToCsv(totalSuppliers, productCountPerSupplier, topSupplier, averageProducts, writer);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=supplier_stats.csv")
                .body(writer.toString());
    }

}
