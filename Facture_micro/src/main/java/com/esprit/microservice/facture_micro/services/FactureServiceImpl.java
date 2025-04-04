package com.esprit.microservice.facture_micro.services;

import java.util.List;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.esprit.microservice.facture_micro.entities.Facture;
import com.esprit.microservice.facture_micro.repositories.FactureRepository;

@Service
public class FactureServiceImpl implements FactureService {
	@Autowired
	FactureRepository factureRepository;
	
	@Override
	public List<Facture> retrieveAllFactures() {
		return (List<Facture>) factureRepository.findAll();
	}

	@Override
	@Transactional

	public Facture addFacture(Facture f) {
		System.out.println("ID utilisateur dans la facture : " + f.getUserId());  // Vérifiez si l'ID utilisateur est bien assigné
		return factureRepository.save(f);
	}


	@Override
	public void deleteFacture(Long id) {
		Facture f = new Facture ();
		f.setIdFacture(id);
		factureRepository.delete(f);
	}

	@Override
	@Transactional
	public Facture updateFacture(Facture f) {
		factureRepository.save(f);
		return f;
	}

	@Override
	public Facture retrieveFacture(Long id) {
		return factureRepository.findById(id).get();
	}


	@Override
	@Transactional
	public Facture activateFacture(Long id) {
		Facture f = factureRepository.findById(id).orElse(null);
		if (f != null && !f.getActive()) {
			f.setActive(true);
			return factureRepository.save(f);
		}
		return null;
	}
}
