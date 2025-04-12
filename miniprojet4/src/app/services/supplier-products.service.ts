import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplierProducts } from '../Model/SupplierProducts';

@Injectable({
  providedIn: 'root'
})
export class SupplierProductsService {
  private baseUrl = 'http://localhost:8084/produit-fournisseurs';

  constructor(private http: HttpClient) { }

  // Add a new supplier product
  public addSupplierProduct(supplierProduct: SupplierProducts, fournisseurId: number): Observable<SupplierProducts> {
    return this.http.post<SupplierProducts>(`${this.baseUrl}/${fournisseurId}`, supplierProduct);
  }

  // Get all suppliers products
  public getAllSupplierProducts(): Observable<SupplierProducts[]> {
    return this.http.get<SupplierProducts[]>(`${this.baseUrl}/all`);
  }

  // Get supplier products by supplier id
  public getSupplierProductsByFournisseur(fournisseurId: number): Observable<SupplierProducts[]> {
    return this.http.get<SupplierProducts[]>(`${this.baseUrl}/by-fournisseur/${fournisseurId}`);
  }

  // Delete supplier product by id
  public deleteSupplierProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
