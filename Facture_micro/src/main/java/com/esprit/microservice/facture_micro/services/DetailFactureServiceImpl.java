package com.esprit.microservice.facture_micro.services;

import java.io.IOException;
import java.util.List;

import com.esprit.microservice.facture_micro.entities.Facture;
import com.esprit.microservice.facture_micro.repositories.FactureRepository;
import com.esprit.microservice.facture_micro.utils.PdfGenerator;
import com.lowagie.text.DocumentException;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.esprit.microservice.facture_micro.entities.DetailFacture;
import com.esprit.microservice.facture_micro.repositories.DetailFactureRepository;

@Service
public class DetailFactureServiceImpl implements DetailFactureService {
	@Autowired
	DetailFactureRepository detailFactureRepository;
	@Autowired
	FactureRepository factureRepository;
	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private EmailService emailService;
	@Override
	public List<DetailFacture> retrieveAlldetailFactures() {
		return (List<DetailFacture>) detailFactureRepository.findAll();
	}

	@Transactional
	@Override
	public DetailFacture adddetailFacture(DetailFacture detail) {
		if (detail.getFacture() == null || detail.getFacture().getIdFacture() == null) {
			throw new IllegalArgumentException("La facture associée au détail est manquante.");
		}

		// Sauvegarder le détail
		DetailFacture savedDetail = detailFactureRepository.save(detail);

		// Recharger la facture
		Facture updatedFacture = factureRepository.findById(detail.getFacture().getIdFacture()).orElse(null);

		if (updatedFacture != null) {
			entityManager.refresh(updatedFacture);

			// Vérifier si le détail est déjà présent dans la liste des détails de la facture
			boolean alreadyExists = updatedFacture.getDetailFacture().stream()
					.anyMatch(existingDetail -> existingDetail.getIdDetailFacture() == savedDetail.getIdDetailFacture()); // Assurez-vous que la comparaison se fait avec un identifiant unique ou un autre champ pertinent

			// Si le détail n'existe pas déjà, l'ajouter à la facture
			if (!alreadyExists) {
				updatedFacture.getDetailFacture().add(savedDetail);
				factureRepository.save(updatedFacture);
			}

			List<DetailFacture> details = updatedFacture.getDetailFacture();
			System.out.println("Détails de la facture : " + details);

			// Génération du PDF et envoi par email
			try {
				String pdfFilePath = PdfGenerator.generateInvoicePdf(updatedFacture);
				emailService.sendInvoiceEmailWithAttachment(
						"ikramsegni28@gmail.com",
						"Facture mise à jour : #" + updatedFacture.getIdFacture(),
						"Bonjour, un nouveau produit a été ajouté à la facture #" + updatedFacture.getIdFacture() + ".",
						pdfFilePath
				);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return savedDetail;
	}


	@Override
	public void deletedetailFacture(Long id) {
		DetailFacture f = new DetailFacture ();
		f.setIdDetailFacture(id);
		detailFactureRepository.delete(f);
	}

	@Override
	@Transactional
	public DetailFacture updatedetailFacture(DetailFacture f) {
	return detailFactureRepository.save(f);


	}

	@Override
	public DetailFacture retrievedetailFacture(Long id) {
		return detailFactureRepository.findById(id).orElse(null);
	}


	@Override
	public int updatedetailFactureQuantite( DetailFacture df) {
		return detailFactureRepository.updatedetailFactureQuantite(df.getQte(), df.getIdDetailFacture());

	}
}