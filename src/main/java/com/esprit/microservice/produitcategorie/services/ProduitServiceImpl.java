package com.esprit.microservice.produitcategorie.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.esprit.microservice.produitcategorie.entities.Produit;
import com.esprit.microservice.produitcategorie.repositories.ProduitRepository;

@Service
public class ProduitServiceImpl implements ProduitService {
	private final Path root = Paths.get("D:/CSAProjects/Integration3/miniProjet4twin/miniprojet4/src/assets/img/ProductPic");
	

    @Autowired 
	ProduitRepository produitrepository;


	@Override
	public List<Produit> retrieveAllProduits() {
		return (List<Produit>)produitrepository.findAll();
	}

	@Override
	public Produit addProduit(Produit p) {

		produitrepository.save(p);
		return p;
	}

	@Override
	public Produit retrieveProduit(Long id) {
		return produitrepository.findById(id).get();
	}

	@Override
	public void deleteProduit(Long id) {
		produitrepository.deleteById(id);
	}

	@Override
	public Produit updateProduit(Produit u) {
		 produitrepository.save(u);
		return u;
		}

	  @Override
	  public void saveImage(MultipartFile  file) {
	    try {
	       Files.copy(file.getInputStream(), this.root.resolve(file.getOriginalFilename()));
	    } catch (Exception e) {
	      throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
	    }
	  }
	public Produit updateProduitById(Long productId, Produit produitDetails) {
		Produit existingProduit = produitrepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

		existingProduit.setCode(produitDetails.getCode());
		existingProduit.setLibelle(produitDetails.getLibelle());
		existingProduit.setDateCreation(produitDetails.getDateCreation());
		existingProduit.setDateDerniereModification(produitDetails.getDateDerniereModification());
		existingProduit.setPrixUnitaire(produitDetails.getPrixUnitaire());
		existingProduit.setImageProduit(produitDetails.getImageProduit());
		existingProduit.setQuantiteEnStock(produitDetails.getQuantiteEnStock());
		existingProduit.setPourcentageRemise(produitDetails.getPourcentageRemise());
		existingProduit.setMoyenneNote(produitDetails.getMoyenneNote());
		existingProduit.setValeur(produitDetails.isValeur());
		existingProduit.setCategorieProduit(produitDetails.getCategorieProduit());

		return produitrepository.save(existingProduit);
	}




}
