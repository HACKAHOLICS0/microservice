import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';

import { SupplierProductsFormComponent } from './supplier-products-form/supplier-products-form.component';
import { SupplierService } from '../services/supplier.service';
import { SupplierProductsService } from '../services/supplier-products.service';
import { SupplierProductsListComponent } from './supplier-products-list/supplier-products-list.component';
import { SuppliersRoutingModule } from './suppliers-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';

const routes: Routes = [
  { path: '', component: SupplierListComponent },
  { path: 'add', component: SupplierFormComponent },
  { path: 'edit/:id', component: SupplierFormComponent },
  { path: ':id/products', component: SupplierProductsListComponent },
  { path: ':id/products/add', component: SupplierProductsFormComponent }
];

@NgModule({
  declarations: [
    SupplierListComponent,
    SupplierFormComponent,
    SupplierProductsListComponent,
    SupplierProductsFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SuppliersRoutingModule,
    NgbModule,
    GoogleChartsModule
  ],
  providers: [
    SupplierService,
    SupplierProductsService
  ]
})
export class SuppliersModule { } 