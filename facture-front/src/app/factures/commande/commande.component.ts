import { Component, OnInit } from '@angular/core';
import { Facture } from "../../Model/Facture";
import { FactureService } from "../../services/facture.service";
import { SessionService } from "../../services/session.service";
import { DetailFactureService } from "../../services/detail-facture.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  facture: Facture;
  showFacture = true;
  showMessage = false;

  constructor(
    private route: Router,
    private factureService: FactureService,
    private sessionService: SessionService,
    private detailFactureService: DetailFactureService
  ) { }

  ngOnInit(): void {
    const user = this.sessionService.getUser();  // Récupérer l'utilisateur actuel de la session

    // Vérification si l'utilisateur est correctement récupéré
    console.log("Utilisateur récupéré: ", user);

    if (user == null) {
      this.route.navigate(['/users/connexion']);  // Rediriger vers la page de connexion si l'utilisateur n'est pas trouvé
    } else if (this.sessionService.getPanier().length <= 0) {
      this.route.navigate(['/factures/panier']);  // Rediriger si le panier est vide
    } else {
      this.facture = new Facture();
      this.facture.active = true;
      this.facture.dateFacture = new Date();

      // Récupérer l'utilisateur et l'assigner à la facture
      this.facture.user = user;
      this.facture.user.idUser = user.idUser;  // S'assurer que l'ID de l'utilisateur est bien affecté

      // Vérification de l'ID de l'utilisateur assigné à la facture
      console.log("ID de l'utilisateur assigné à la facture: ", this.facture.user.idUser);

      // Convertir le panier en facture
      this.factureService.FromPanierToFacture(this.facture, this.sessionService.getPanier());
    }
  }

  addFacture(f: Facture): void {
    const user = this.sessionService.getUser();
    if (user) {
      f.userId = user.idUser;  // Assurez-vous d'affecter l'ID utilisateur à userId
      console.log("ID utilisateur assigné à la facture : ", f.userId);

      // Traiter chaque élément du panier et assigner les IDs des produits
      f.detailFacture.forEach(item => {
        item.productId = item.produit.idProduit;  // Assigner l'ID du produit
      });

      // Ajouter la facture d'abord, puis ajouter les détails avec le factureId
      this.factureService.addFacture(f).subscribe((fact) => {
        // Après avoir créé la facture, assigne le factureId à chaque détail
        f.idFacture = fact.idFacture;  // Assigner l'ID de la facture à chaque détail

        // Ajouter chaque détail de la facture
        for (let item of f.detailFacture) {
          this.detailFactureService.add(item, fact.idFacture).subscribe(
            () => {
              this.facture = new Facture();
              this.sessionService.setPanier([]);  // Vider le panier après la création de la facture
              this.showFacture = false;
            }
          );
        }

        this.showFacture = false;
        this.BackToProduct();
      });
    }
  }





  BackToProduct(): void {
    this.showMessage = true;
  }
}
