import { Injectable } from "@angular/core";
import { Panier } from "../Model/Panier";
import { User } from "../Model/user";
import { Produit } from "../Model/Produit";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private user: User | null = null;
  private panier: Panier[] = [];

  constructor() {
    this.loadUserFromLocalStorage(); // Load user from localStorage when the service is initialized
    if (!this.user) {
      // If no user is found, set a default user (test user for now)
      this.setTestUser(); // You can set this based on some condition (like testing mode)
    }
  }

  // Set a default test user
  setTestUser() {
    this.user = {
      idUser: 1,
      email: 'test@user.com',
      badge: 'MODERATEUR',  // Default user badge
    // badge: 'USER',
      nom: 'Test',
      prenom: 'User',
      dateNaissance: new Date('1990-01-01'),
      password: 'password123',
      urlpicture: '',
      token: '',
      codepromo: null,
      promoActive: false,
      factures: [],
      likedislike: [],
      notes: [],
      reponses: [],
      reclamations: []
    };
    this.saveUserToLocalStorage(); // Save user to localStorage
  }

  // Load user from localStorage
  loadUserFromLocalStorage() {
    const data = localStorage.getItem('user');
    if (data) {
      this.user = JSON.parse(data);
    }
  }

  // Save user to localStorage
  saveUserToLocalStorage() {
    if (this.user) {
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }

  // Get current user
  getUser(): User | null {
    return this.user;
  }

  // Set current user
  setUser(u: User) {
    this.user = u;
    this.saveUserToLocalStorage(); // Save to localStorage
  }

  // Get session type based on user badge
  getSessionType(): string {
    if (this.user) {
      if (this.user.badge === 'USER' || this.user.badge === 'Ordinaire' || this.user.badge === 'Premium') {
        return 'USER';
      } else if (this.user.badge === 'MODERATEUR') {
        return 'MODERATEUR';
      }
    }
    return 'NL'; // If no user is defined
  }

  // Clear session (reset user and panier)
  clearSession() {
    this.user = null;
    this.panier = [];
    localStorage.removeItem('user'); // Remove user from localStorage
  }

  // Methods related to panier (cart)
  setPanier(p: Panier[]) {
    localStorage.setItem('panier', JSON.stringify(p));
  }

  addToPanier(produit: Produit, quantite: number) {
    let p = new Panier();
    p.quantite = quantite;
    p.produit = produit;
    let datapanier = localStorage.getItem('panier');
    let panier = datapanier ? JSON.parse(datapanier) : [];
    panier.push(p);
    localStorage.setItem('panier', JSON.stringify(panier));
  }

  getPanier(): Panier[] {
    let panier: Panier[] = [];
    let data = localStorage.getItem('panier');
    if (data) {
      panier = JSON.parse(data);
    }
    return panier;
  }

  getlist(): any[] {
    let list: any[] = [];
    let data = localStorage.getItem('panier');
    if (data) {
      list = JSON.parse(data);
    }
    return list;
  }
}
