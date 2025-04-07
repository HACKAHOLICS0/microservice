package com.esprit.microservice.produitcategorie.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.esprit.microservice.produitcategorie.entities.CategorieProduit;
import com.esprit.microservice.produitcategorie.repositories.CategorieProduitRepository;

@Service
public class CategorieProduitServiceImpl implements CategorieProduitService {

	@Autowired
	CategorieProduitRepository categorieRep;

	@Override
	public List<CategorieProduit> retrieveAllCategorieProduits() {
		return (List<CategorieProduit>) categorieRep.findAll();
	}

	@Override
	public CategorieProduit addCategorieProduit(CategorieProduit c) {
		categorieRep.save(c);
		return c;

	}

	@Override
	public CategorieProduit retrieveCategorieProduit(Long id) {
		return  categorieRep.findById(id).get();

	}

	@Override
	public CategorieProduit updateCategorieProduit(CategorieProduit u) {
		categorieRep.save(u);
		return u;
	}

	@Override
	public List<CategorieProduit> deleteCategorieProduit(Long id) {
		categorieRep.deleteById(id);
		return (List<CategorieProduit>) categorieRep.findAll();
	}

	public CategorieProduit updateCategorieProduitById(Long id, CategorieProduit categorieDetails) {
		CategorieProduit existingCategorie = categorieRep.findById(id)
				.orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));

		existingCategorie.setLibelle(categorieDetails.getLibelle());
		existingCategorie.setCategorieProduitIcone(categorieDetails.getCategorieProduitIcone());

		return categorieRep.save(existingCategorie);
	}

}
