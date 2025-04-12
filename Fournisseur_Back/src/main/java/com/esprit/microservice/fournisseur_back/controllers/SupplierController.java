package com.esprit.microservice.fournisseur_back.controllers;

import com.esprit.microservice.fournisseur_back.entities.Supplier;
import com.esprit.microservice.fournisseur_back.services.GeolocationService;
import com.esprit.microservice.fournisseur_back.services.SupplierProductsServiceImpl;
import com.esprit.microservice.fournisseur_back.services.SupplierService;
import com.esprit.microservice.fournisseur_back.services.SupplierServiceImpl;
import com.esprit.microservice.fournisseur_back.utils.CsvExporter;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fournisseurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupplierController {
    @Autowired
    SupplierService supplierService;


    @Autowired
    private GeolocationService geolocationService;

    //http://localhost:8084/fournisseurs/geolocate/{id}
    @Operation(summary = "Geolocate supplier by ID")
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
                        String lat = (String) result.get("lat");
                        String lon = (String) result.get("lon");
                        String googleMapsUrl = "https://www.google.com/maps?q=" + lat + "," + lon;
                        Map<String, Object> enrichedResult = new HashMap<>(result);
                        enrichedResult.put("googleMapsUrl", googleMapsUrl);

                        return ResponseEntity.ok(enrichedResult);
                    });

        } catch (Exception e) {
            e.printStackTrace(); // log dans la console
            return Mono.just(ResponseEntity.status(500).body(Map.of("error", "Internal error", "details", e.getMessage())));
        }
    }




    //http://localhost:8084/fournisseurs/all
    @Operation(summary = "Get all suppliers")
    @GetMapping("/all")
    public List<Supplier> getAll() {
        return supplierService.getAllSuppliers();
    }

    //http://localhost:8084/fournisseurs/{id}
    @Operation(summary = "Get supplier by ID")
    @GetMapping("/{id}")
    public Supplier getById(@PathVariable Long id) {
        return supplierService.getSupplier(id);
    }

    //http://localhost:8084/fournisseurs/add
    @Operation(summary = "Add a new supplier")
    @PostMapping("/add")
    public Supplier add(@RequestBody Supplier supplier) {
        return supplierService.addSupplier(supplier);
    }

    //http://localhost:8084/fournisseurs/update/{id}
    @Operation(summary = "Update supplier by ID")
    @PutMapping("/update/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier supplier) {
        return supplierService.updateSupplier(id, supplier);
    }

    //http://localhost:8084/fournisseurs/delete/{id}
    @Operation(summary = "Delete supplier by ID")
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
    }

    //http://localhost:8084/fournisseurs/stats/total
    @Operation(summary = "Get total number of suppliers")
    @GetMapping("/stats/total")
    public ResponseEntity<Integer> getTotalSuppliers() {
        return ResponseEntity.ok(supplierService.getTotalSuppliers());
    }

    //http://localhost:8084/fournisseurs/stats/products-per-supplier
    @Operation(summary = "Get product count per supplier")
    @GetMapping("/stats/products-per-supplier")
    public ResponseEntity<Map<String, Long>> getProductCountPerSupplier() {
        return ResponseEntity.ok(supplierService.getProductCountPerSupplier());
    }

    //http://localhost:8084/fournisseurs/stats/top-supplier
    @Operation(summary = "Get top supplier by product count")
    @GetMapping("/stats/top-supplier")
    public ResponseEntity<Supplier> getTopSupplier() {
        return ResponseEntity.ok(supplierService.getTopSupplierByProductCount());
    }

    //http://localhost:8084/fournisseurs/stats/average-products
    @Operation(summary = "Get average products per supplier")
    @GetMapping("/stats/average-products")
    public ResponseEntity<Double> getAverageProducts() {
        return ResponseEntity.ok(supplierService.getAverageProductsPerSupplier());
    }

    //http://localhost:8084/fournisseurs/stats/export/all-stats
    @Operation(summary = "Get all stats into csv")
    // New endpoint to export all stats to CSV
    @GetMapping("/stats/export/all-stats")
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
