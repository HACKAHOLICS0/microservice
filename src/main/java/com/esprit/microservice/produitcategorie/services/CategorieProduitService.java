package com.esprit.microservice.produitcategorie.services;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.esprit.microservice.produitcategorie.entities.CategorieProduit;


public interface CategorieProduitService {
	public List<CategorieProduit> retrieveAllCategorieProduits();
	public CategorieProduit addCategorieProduit(CategorieProduit c);
	public CategorieProduit retrieveCategorieProduit(Long id);
	public CategorieProduit updateCategorieProduit(CategorieProduit u);
	public List<CategorieProduit> deleteCategorieProduit(Long id);
	public CategorieProduit updateCategorieProduitById(Long id, CategorieProduit categorieDetails);

}
