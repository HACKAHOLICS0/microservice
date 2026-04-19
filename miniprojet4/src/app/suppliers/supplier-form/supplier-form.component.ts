import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { CommonModule } from '@angular/common';
import { Supplier } from 'src/app/Model/Supplier';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;
  supplierId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.supplierForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      etat: [true]
    });
  }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.params['id'];
    if (this.supplierId) {
      this.isEditMode = true;
      this.loadSupplier();
    }
  }

  loadSupplier(): void {
    if (this.supplierId) {
      this.supplierService.getSupplier(this.supplierId).subscribe(
        (supplier) => {
          this.supplierForm.patchValue(supplier);
        },
        (error) => {
          console.error('Error loading supplier:', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const supplier: Supplier = this.supplierForm.value;
      
      if (this.isEditMode && this.supplierId) {
        this.supplierService.updateSupplier(this.supplierId, supplier).subscribe(
          () => {
            this.router.navigate(['/suppliers']);
          },
          (error) => {
            console.error('Error updating supplier:', error);
          }
        );
      } else {
        this.supplierService.addSupplier(supplier).subscribe(
          () => {
            this.router.navigate(['/suppliers']);
          },
          (error) => {
            console.error('Error adding supplier:', error);
          }
        );
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/suppliers']);
  }
} 