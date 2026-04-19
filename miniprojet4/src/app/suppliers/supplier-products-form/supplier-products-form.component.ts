import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierProductsService } from '../../services/supplier-products.service';
import { CommonModule } from '@angular/common';
import { SupplierProducts } from 'src/app/Model/SupplierProducts';

@Component({
  selector: 'app-supplier-products-form',
  templateUrl: './supplier-products-form.component.html',
  styleUrls: ['./supplier-products-form.component.css']
})
export class SupplierProductsFormComponent implements OnInit {
  supplierProductForm: FormGroup;
  supplierId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private supplierProductsService: SupplierProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.supplierProductForm = this.fb.group({
      qte: [1, [Validators.required, Validators.min(1)]],
      produit: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.params['id'];
  }

  onSubmit(): void {
    if (this.supplierProductForm.valid && this.supplierId) {
      const supplierProduct: SupplierProducts = this.supplierProductForm.value;
      
      this.supplierProductsService.addSupplierProduct(supplierProduct, this.supplierId).subscribe(
        () => {
          this.router.navigate(['/suppliers', this.supplierId, 'products']);
        },
        (error) => {
          console.error('Error adding supplier product:', error);
        }
      );
    }
  }

  cancel(): void {
    if (this.supplierId) {
      this.router.navigate(['/suppliers', this.supplierId, 'products']);
    }
  }
} 