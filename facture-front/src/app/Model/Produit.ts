import {DetailFacture} from "./detailFacture";

export class Produit {
  idProduit: number;
  code: string;
  libelle: string;
  dateCreation: Date;
  dateDerniereModification: Date;
  prixUnitaire:number;
  imageProduit: string;
  quantiteEnStock:number;
  pourcentageRemise:number;
  detailF: DetailFacture[];
  likedislike: any[];
  listNotes:any[];
 note:any;
 valeur:boolean;
  constructor(idProduit: number, code: string, libelle: string, dateCreation: Date, dateDerniereModification: Date, prixUnitaire: number,
               imageProduit: string, quantiteEnStock: number, pourcentageRemise: number,valeur:boolean) {
    this.idProduit = idProduit;
    this.code = code;
    this.libelle = libelle;
    this.dateCreation = dateCreation;
    this.dateDerniereModification = dateDerniereModification;
    this.prixUnitaire = prixUnitaire;


    this.imageProduit = "/assets/img/ProductPic/" +imageProduit;

    this.quantiteEnStock = quantiteEnStock;
    this.pourcentageRemise = pourcentageRemise;
    this.valeur=false;
  }
}


