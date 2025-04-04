package com.esprit.microservice.facture_micro.controllers;

import java.util.List;

import com.esprit.microservice.facture_micro.services.FactureServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.esprit.microservice.facture_micro.entities.Facture;
import com.esprit.microservice.facture_micro.services.FactureService;
@RestController
@RequestMapping("/Facture")

public class FactureRestController {
	@Autowired
	FactureServiceImpl FactureService ;
	//http://localhost:8081/SpringMVC/Facture/retrieve-all-Factures
	@GetMapping("/retrieve-all-Factures")
	@ResponseBody
	public List<Facture> getFactures() {
		List<Facture> listFacture = FactureService.retrieveAllFactures();
		return listFacture;
	}
	//http://localhost:8081/SpringMVC/Facture/retrieve/{facture-id}
	@GetMapping("/retrieve/{facture-id}")
	@ResponseBody
	public Facture getFacture(@PathVariable("facture-id")Long factureId) {
		Facture f = FactureService.retrieveFacture(factureId);
		return f;
	}
	//http://localhost:8081/SpringMVC/Facture/add-facture

	@PostMapping("/add-facture")
	@ResponseBody
	public Facture addFacture(@RequestBody Facture f) {
		return FactureService.addFacture(f);
	}
	//http://localhost:8081/SpringMVC/Facture/remove-facture/{facture-id}
	@DeleteMapping("/remove-facture/{facture-id}")
	@ResponseBody
	public void removeFacture(@PathVariable("facture-id") Long factureId) {
		FactureService.deleteFacture(factureId);
	}
	// http://localhost:8081/SpringMVC/Facture/modify-facture
	@PutMapping("/modify-facture")
	@ResponseBody
	public Facture modifyClient(@RequestBody Facture f) {
		return FactureService.updateFacture(f);
	}
}
