package com.esprit.microservice.produitcategorie.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.esprit.microservice.produitcategorie.entities.CategorieProduit;
import com.esprit.microservice.produitcategorie.services.CategorieProduitService;


@RestController
@RequestMapping("/productCategory")
@CrossOrigin(origins = "*")
@ComponentScan(basePackages= {"tn.esprit.spring.services"})
public class CategorieProduitRestController {

		@Autowired
		CategorieProduitService categorieProduitService;

		@GetMapping("/retrieve-all-productsCategories")
		public List<CategorieProduit> getProductsCategories() {
			return categorieProduitService.retrieveAllCategorieProduits();
		}

		@GetMapping("/retrieve-productCategory/{productCategory-id}")

		public CategorieProduit retrieveProductCategory(@PathVariable("productCategory-id") Long productcategoryid) {
			return categorieProduitService.retrieveCategorieProduit(productcategoryid);
		}
		@PostMapping("/add-productCategory")
		public CategorieProduit addProductCategory(@RequestBody CategorieProduit c) {
			return categorieProduitService.addCategorieProduit(c);
		}
		@DeleteMapping("/remove-productCategory/{productCategory-id}")

		public void removeProductCategory(@PathVariable("productCategory-id") Long productcategoryid) {
			categorieProduitService.deleteCategorieProduit(productcategoryid);
		}

		@PutMapping("/modify-productCategory")

		public CategorieProduit modifyProductCategory(@RequestBody CategorieProduit c) {
			return categorieProduitService.updateCategorieProduit(c);
		}
	@PutMapping("/modify-productCategory/{productCategory-id}")
	public CategorieProduit updateCategoryById(@PathVariable("productCategory-id") Long id,
											   @RequestBody CategorieProduit categorieDetails) {
		return categorieProduitService.updateCategorieProduitById(id, categorieDetails);
	}
}

