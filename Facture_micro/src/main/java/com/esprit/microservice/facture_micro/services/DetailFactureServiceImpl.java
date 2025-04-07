package com.esprit.microservice.facture_micro.services;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

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
		if (detail.getFacture().getIdFacture()==null) {
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
		try {
			// Suppression du détail de facture par son ID
			detailFactureRepository.deleteById(id);
		} catch (Exception e) {
			throw new RuntimeException("La suppression du détail de facture a échoué.", e);
		}
	}


	@Transactional
	@Override
	public DetailFacture updatedetailFacture(DetailFacture f) {
		// Récupérer le détail de facture par son ID
		DetailFacture existingDetailFacture = detailFactureRepository.findById(f.getIdDetailFacture())
				.orElseThrow(() -> new IllegalArgumentException("Le détail de facture n'existe pas."));

		// Récupérer la facture associée au détail de facture existant
		Facture facture = existingDetailFacture.getFacture();
		if (facture == null) {
			throw new IllegalArgumentException("La facture associée à ce détail n'existe pas.");
		}

		// Mettre à jour les informations du détail de facture
		existingDetailFacture.setProductId(f.getProductId());
		existingDetailFacture.setQte(f.getQte());

		// Sauvegarder le détail de facture mis à jour
		return detailFactureRepository.save(existingDetailFacture);
	}

	@Override
	public Optional<DetailFacture> findById(Long idDetailFacture) {
		return detailFactureRepository.findById(idDetailFacture);
	}




	@Override
	public void retrievedetailFacture(Long id) {
		DetailFacture existingDetailFacture = detailFactureRepository.findById(id).orElse(null);

		if (existingDetailFacture != null) {
			// Supprimer le détail de facture si trouvé
			detailFactureRepository.delete(existingDetailFacture);
		} else {
			throw new IllegalArgumentException("Le détail de facture avec l'ID " + id + " n'existe pas.");
		}
	}



	@Override
	public int updatedetailFactureQuantite( DetailFacture df) {
		return detailFactureRepository.updatedetailFactureQuantite(df.getQte(), df.getIdDetailFacture());

	}

	@Transactional
	@Override
	public void deleteDetailFacturesByFactureId(Long factureId) {
		try {
			// Vérifier si la facture existe
			Facture facture = factureRepository.findById(factureId).orElse(null);
			if (facture != null) {
				// Supprimer tous les détails associés
				List<DetailFacture> detailsFacture = facture.getDetailFacture();
				if (detailsFacture != null) {
					for (DetailFacture detail : detailsFacture) {
						detailFactureRepository.delete(detail);  // Suppression de chaque détail
					}
				}
				// Une fois les détails supprimés, supprimer la facture si nécessaire
				factureRepository.delete(facture); // Vous pouvez aussi choisir de ne pas supprimer la facture elle-même ici
			}
		} catch (Exception e) {
			throw new RuntimeException("La suppression des détails de facture a échoué.", e);
		}
	}

}