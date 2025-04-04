package com.esprit.microservice.facture_micro.controllers;

import java.util.List;

import com.esprit.microservice.facture_micro.entities.Facture;
import com.esprit.microservice.facture_micro.services.FactureServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.esprit.microservice.facture_micro.entities.DetailFacture;
import com.esprit.microservice.facture_micro.services.DetailFactureService;

@CrossOrigin("*")
@RestController
@RequestMapping("/DetailFacture")
public class DetailFactureRestController {
	@Autowired
	DetailFactureService detailFactureService;
	@Autowired
	FactureServiceImpl factureService;
	//http://localhost:8082/SpringMVC/DetailFacture/retrieve-all-detailFactures
	@GetMapping("/retrieve-all-detailFactures")
	@ResponseBody
	public List<DetailFacture> getDetailFactures() {
		List<DetailFacture> listdetailFacture = detailFactureService.retrieveAlldetailFactures();
		return listdetailFacture;
	}
	@PostMapping("/add/{facture-id}")
	@ResponseBody
	public DetailFacture add(@RequestBody DetailFacture df,@PathVariable("facture-id") Long idFacture) {
		Facture f = factureService.retrieveFacture(idFacture);
		df.setFacture(f);
		return detailFactureService.adddetailFacture(df);
	}
	//http://localhost:8082/SpringMVC/DetailFacture/modify
	@PutMapping("/modify")
	@ResponseBody
	public DetailFacture modifyDetailFacture(@RequestBody DetailFacture df) {
		return detailFactureService.updatedetailFacture(df);
	}
	@PutMapping("/modify/quantite")
	@ResponseBody
	public int modifyDetailFacturequantite(@RequestBody DetailFacture df) {
		return detailFactureService.updatedetailFactureQuantite(df);
	}
	@DeleteMapping("/remove/{detailfacture-id}")
	@ResponseBody
	public void removeDetailFacture(@PathVariable("detailfacture-id") Long detailfactureId) {
		detailFactureService.deletedetailFacture(detailfactureId);

	}

}
