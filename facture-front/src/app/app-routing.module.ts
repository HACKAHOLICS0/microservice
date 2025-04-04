import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import {ProduitComponent} from "./products/produit/produit.component";

const routes: Routes = [

  {path : 'home', component: ProduitComponent},



  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },


  { path: 'factures', loadChildren: () => import('./factures/factures.module').then(m => m.FacturesModule) },






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
