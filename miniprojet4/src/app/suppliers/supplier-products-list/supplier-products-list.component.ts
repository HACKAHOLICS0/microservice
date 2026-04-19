import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierProductsService } from '../../services/supplier-products.service';
import { CommonModule } from '@angular/common';
import { SupplierProducts } from 'src/app/Model/SupplierProducts';

@Component({
  selector: 'app-supplier-products-list',
  templateUrl: './supplier-products-list.component.html',
  styleUrls: ['./supplier-products-list.component.css']
})
export class SupplierProductsListComponent implements OnInit {
  supplierProducts: SupplierProducts[] = [];
  supplierId: number | null = null;
  searchTerm: string = '';

  constructor(
    private supplierProductsService: SupplierProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.params['id'];
    if (this.supplierId) {
      this.loadSupplierProducts();
    }
  }

  loadSupplierProducts(): void {
    if (this.supplierId) {
      this.supplierProductsService.getSupplierProductsByFournisseur(this.supplierId).subscribe(
        (data) => {
          this.supplierProducts = data;
        },
        (error) => {
          console.error('Error loading supplier products:', error);
        }
      );
    }
  }

  addProduct(): void {
    if (this.supplierId) {
      this.router.navigate(['/suppliers', this.supplierId, 'products', 'add']);
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.supplierProductsService.deleteSupplierProduct(id).subscribe(
        () => {
          this.loadSupplierProducts();
        },
        (error) => {
          console.error('Error deleting supplier product:', error);
        }
      );
    }
  }

  searchProducts(): void {
    if (this.searchTerm.trim() === '') {
      this.loadSupplierProducts();
      return;
    }

    this.supplierProducts = this.supplierProducts.filter(product =>
      product.produit.libelle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.produit.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);
  }
} 