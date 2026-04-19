package com.esprit.microservice.fournisseur_back.utils;

import com.esprit.microservice.fournisseur_back.entities.Supplier;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.IOException;
import java.io.Writer;
import java.util.List;
import java.util.Map;

public class CsvExporter {
    public static void exportAllStatsToCsv(int totalSuppliers, Map<String, Long> productCountPerSupplier,
                                           Supplier topSupplier, double averageProducts, Writer writer) throws IOException {
        try (CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader("Statistic", "Value"))) {
            // Export total suppliers count
            csvPrinter.printRecord("Total Suppliers", totalSuppliers);

            // Export product count per supplier
            csvPrinter.printRecord("Product Count Per Supplier");
            for (Map.Entry<String, Long> entry : productCountPerSupplier.entrySet()) {
                csvPrinter.printRecord(entry.getKey(), entry.getValue());
            }

            // Export top supplier
            csvPrinter.printRecord("Top Supplier", topSupplier.getNom());
            csvPrinter.printRecord("Top Supplier Product Count", topSupplier.getProducts().size());

            // Export average products per supplier
            csvPrinter.printRecord("Average Products Per Supplier", averageProducts);
        }
    }
}
