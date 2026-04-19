import { SupplierProducts } from "./SupplierProducts";

export interface Supplier {
    id?: number;
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
    dateAjout: string; // Use string if date is in ISO format from backend (e.g., "2025-04-12")
    etat: boolean;
    montantSupplier?: number;
    SupplierProducts?: SupplierProducts[];
}
  