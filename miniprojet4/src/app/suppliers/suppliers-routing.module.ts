import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuppliersComponent } from './suppliers.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SupplierProductsListComponent } from './supplier-products-list/supplier-products-list.component';
import { SupplierProductsFormComponent } from './supplier-products-form/supplier-products-form.component';

const routes: Routes = [
  { path: '', component: SuppliersComponent },
  { path: 'list', component: SupplierListComponent },
  { path: 'add', component: SupplierFormComponent },
  { path: 'edit/:id', component: SupplierFormComponent },
  { path: ':id/products', component: SupplierProductsListComponent },
  { path: ':id/products/add', component: SupplierProductsFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { } 