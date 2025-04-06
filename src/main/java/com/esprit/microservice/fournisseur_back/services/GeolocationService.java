package com.esprit.microservice.fournisseur_back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeolocationService {

    @Autowired
    WebClient.Builder webClientBuilder;

    public Mono<Map<String, Object>> geocodeAddress(String adresse) {
        return webClientBuilder.build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("nominatim.openstreetmap.org")
                        .path("/search")
                        .queryParam("q", adresse)
                        .queryParam("format", "json")
                        .queryParam("limit", "1")
                        .build())
                .header("User-Agent", "fournisseur-app")
                .retrieve()
                .bodyToMono(List.class)
                .map(results -> {
                    if (results.isEmpty()) return null;
                    return (Map<String, Object>) results.get(0);
                });
    }
}
