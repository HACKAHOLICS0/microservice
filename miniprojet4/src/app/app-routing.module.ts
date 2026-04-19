import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';


const routes: Routes = [

  {path : 'home', component: HomeComponent},


  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },

  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },

  { path: 'reclamations', loadChildren: () => import('./reclamations/reclamations.module').then(m => m.ReclamationsModule) },

  { path: 'factures', loadChildren: () => import('./factures/factures.module').then(m => m.FacturesModule) },

  { path: 'CodePromo', loadChildren: () => import('./code-promo/code-promo.module').then(m => m.CodePromoModule) },

  { path: 'LikeDislike', loadChildren: () => import('./like-dislike/like-dislike.module').then(m => m.LikeDislikeModule) },

  { path: 'suppliers', loadChildren: () => import('./suppliers/suppliers.module').then(m => m.SuppliersModule) },

  { path: 'preferences', loadChildren: () => import('./user-preferences/user-preferences.module').then(m => m.UserPreferencesModule) },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
