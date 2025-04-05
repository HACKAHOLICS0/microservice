package com.esprit.microservice.facture_micro.services;

import java.io.IOException;
import java.util.List;
import java.util.Date;

import com.esprit.microservice.facture_micro.entities.DetailFacture;
import com.esprit.microservice.facture_micro.utils.FactureAddedEvent;
import com.esprit.microservice.facture_micro.utils.PdfGenerator;
import com.lowagie.text.DocumentException;
import jakarta.mail.MessagingException;
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
	@Autowired
	private EmailService emailService;  // Injecter l'instance de EmailService

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

		// Convertir les détails de la facture en String pour le PDF
		StringBuilder detailsStringBuilder = new StringBuilder();
		for (DetailFacture detail : savedFacture.getDetailFacture()) {
			// Ajouter des informations spécifiques de chaque détail dans le format que vous voulez
			detailsStringBuilder.append("Produit: ").append(detail.getIdDetailFacture()).append(", ");
			detailsStringBuilder.append("Quantité: ").append(detail.getQte()).append(", ");
		}

		// Générer le PDF de la facture avec les détails convertis en String
		String pdfFilePath = "";
		try {
			// Passer tous les détails requis pour la génération du PDF
			pdfFilePath = PdfGenerator.generateInvoicePdf(savedFacture); // Vous avez déjà l'objet 'savedFacture', donc l'utiliser directement
		} catch (IOException | DocumentException e) {
			e.printStackTrace(); // Gérer les erreurs lors de la génération du PDF
		}

		// Publier l'événement
		eventPublisher.publishEvent(new FactureAddedEvent(this, savedFacture.getIdFacture()));

		// Envoyer l'e-mail avec le PDF en pièce jointe
		if (!pdfFilePath.isEmpty()) {
			try {
				// Utilisez votre service EmailService pour envoyer l'email avec la facture en pièce jointe
				emailService.sendInvoiceEmailWithAttachment(
						"ikramsegni28@gmail.com", // Adresse e-mail statique
						"Nouvelle facture ajoutée : #" + savedFacture.getIdFacture(),
						"Bonjour, une nouvelle facture a été ajoutée avec l'ID " + savedFacture.getIdFacture() + ".",
						pdfFilePath  // Chemin du fichier PDF généré
				);
			} catch (MessagingException e) {
				e.printStackTrace();  // Gestion des erreurs d'envoi d'email
			}
		}

		return savedFacture;
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
