import { Produit } from "./Produit";

export interface SupplierProducts {
    id?: number;
    qte: number;
    produit: Produit;
    supplierId?: number;
}