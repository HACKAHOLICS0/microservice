package com.esprit.microservice.facture_micro.services;

import java.util.List;
import java.util.Date;

import com.esprit.microservice.facture_micro.entities.DetailFacture;
import com.esprit.microservice.facture_micro.utils.FactureAddedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.esprit.microservice.facture_micro.entities.Facture;
import com.esprit.microservice.facture_micro.repositories.FactureRepository;

@Service
public class FactureServiceImpl implements FactureService {
	@Autowired
	FactureRepository factureRepository;
	private final ApplicationEventPublisher eventPublisher;

	public FactureServiceImpl(ApplicationEventPublisher eventPublisher, FactureRepository factureRepository) {
		this.eventPublisher = eventPublisher;
		this.factureRepository = factureRepository;
	}

	@Override
	public List<Facture> retrieveAllFactures() {
		return (List<Facture>) factureRepository.findAll();
	}

	@Override
	@Transactional

	public Facture addFacture(Facture f) {
		// Associer la facture à ses détails
		for (DetailFacture detail : f.getDetailFacture()) {
			detail.setFacture(f);  // Associe chaque détail à la facture
		}

		System.out.println("ID utilisateur dans la facture : " + f.getUserId());  // Vérifiez si l'ID utilisateur est bien assigné
		Facture savedFacture = factureRepository.save(f);

		// Publier l'événement
		eventPublisher.publishEvent(new FactureAddedEvent(this, savedFacture.getIdFacture()));

		return savedFacture;
		// Sauvegarde la facture et ses détails
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
		// Associer la facture aux détails avant la mise à jour
		for (DetailFacture detail : f.getDetailFacture()) {
			detail.setFacture(f);  // Associe chaque détail à la facture
		}

		// Enregistrer la facture avec ses détails associés
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
