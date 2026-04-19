import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Panier } from "../Model/Panier";
import { Produit } from "../Model/Produit";
import { Supplier } from '../Model/Supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private baseUrl = 'http://localhost:8085/fournisseurs';

  constructor(private http: HttpClient) { }

  // Get all suppliers
  public getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/all`);
  }

  // Get supplier by ID
  public getSupplier(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/${id}`);
  }

  // Add new supplier
  public addSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.baseUrl}/add`, supplier);
  }

  // Update supplier
  public updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.baseUrl}/update/${id}`, supplier);
  }

  // Delete supplier
  public deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // Get total number of suppliers
  public getTotalSuppliers(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/stats/total`);
  }

  // Get product count per supplier
  public getProductCountPerSupplier(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.baseUrl}/stats/products-per-supplier`);
  }

  // Get top supplier by product count
  public getTopSupplierByProductCount(): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/stats/top-supplier`);
  }

  // Get average products per supplier
  public getAverageProductsPerSupplier(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/stats/average-products`);
  }

  // Export all stats to CSV
  public exportAllStatsToCsv(): Observable<string> {
    return this.http.get(`${this.baseUrl}/stats/export/all-stats`, { responseType: 'text' });
  }

  // Geolocate supplier
  public geolocateSupplier(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/geolocate/${id}`);
  }

  
}
