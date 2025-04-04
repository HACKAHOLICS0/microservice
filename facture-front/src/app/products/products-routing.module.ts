import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import {ProduitComponent} from "./produit/produit.component";

const routes: Routes = [{ path: '', component: ProductsComponent },
  
  {path:'produit' , component:ProduitComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
