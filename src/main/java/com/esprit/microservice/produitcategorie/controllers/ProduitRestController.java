
package com.esprit.microservice.produitcategorie.controllers;

import java.util.List;

import com.esprit.microservice.produitcategorie.services.EmailService;
import com.esprit.microservice.produitcategorie.entities.FeedBack;
import com.esprit.microservice.produitcategorie.entities.Produit;
import com.esprit.microservice.produitcategorie.services.FeedBackService;
import com.esprit.microservice.produitcategorie.services.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/product")

public class ProduitRestController {

	@Autowired
	ProduitService produitService;
	@Autowired
	private FeedBackService feedBackService;

	@Autowired
	private EmailService emailservice;

	@GetMapping("/retrieve-all-products")
	public List<Produit> getProducts() {
		return produitService.retrieveAllProduits();
	}

	@GetMapping("/retrieve-product/{product-id}")

	public Produit retrieveProduct(@PathVariable("product-id") Long productid) {
		return produitService.retrieveProduit(productid);
	}
	@PostMapping("/add-product")

	public Produit addProduct(@RequestBody Produit c) {
		return produitService.addProduit(c);
	}

	@DeleteMapping("/remove-product/{product-id}")

	public void removeProduct(@PathVariable("product-id") Long clientId) {
		produitService.deleteProduit(clientId);
	}

	@PutMapping("/modify-product")
	public Produit modifyProduct(@RequestBody Produit produit) {
		return produitService.updateProduit(produit);
	}

	@PutMapping("/update-product/{product-id}")
	public Produit updateProductById(@PathVariable("product-id") Long productId, @RequestBody Produit produitDetails) {
		return produitService.updateProduitById(productId, produitDetails);
	}
	// Add new feedback and send an email
	@PostMapping("/addfeedback")
	public ResponseEntity<FeedBack> addFeedback(@RequestBody FeedBack feedback) {

		// Save the feedback and trigger PDF generation
		FeedBack savedFeedback = feedBackService.saveFeedback(feedback);

		// Send email notification after feedback is saved
		String subject = "New Feedback Submitted";
		String message = "A new feedback has been submitted:\n\n" +
				"Rating: " + savedFeedback.getRating() + "\n" +
				"Comment: " + savedFeedback.getComment();
		// Replace with the recipient email (e.g., teacher or admin email)
		String recipientEmail = "hmidahmed049@gmail.com";  // Change this to the appropriate recipient email
		emailservice.sendVerificationCode(recipientEmail, message);

		return ResponseEntity.ok(savedFeedback);
	}
}
