package com.esprit.microservice.produitcategorie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication

public class ProduitCategorieApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProduitCategorieApplication.class, args);
    }

}
