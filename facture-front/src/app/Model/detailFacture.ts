import { Produit } from "./Produit";
import { Facture } from "./Facture";

export class DetailFacture {
  idDetailFacture: number;
  qte: number;
  produit: Produit;
  productId: number;  // ID du produit pour correspondre avec l'entité backend
}
