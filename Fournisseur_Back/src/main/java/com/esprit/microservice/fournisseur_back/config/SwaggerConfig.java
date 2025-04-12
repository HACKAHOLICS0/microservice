package com.esprit.microservice.fournisseur_back.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@OpenAPIDefinition(info = @Info(
        title = "Fournisseur Microservice API",
        version = "1.0",
        description = "Documentation des APIs pour Fournisseur et FournisseurProduits"
))
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new io.swagger.v3.oas.models.info.Info()
                        .title("Fournisseur Microservice API")
                        .version("1.0")
                        .description("Documentation des APIs pour Fournisseur et FournisseurProduits"))
                .servers(List.of(
                        new Server().url("http://localhost:8084").description("API Gateway for supplier service")
                ));
    }
}