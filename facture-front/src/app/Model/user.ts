import { Facture } from "./Facture";

export class User{
    idUser: number;
    nom: string;
    prenom: string;
    dateNaissance: Date;
    email: string;
    password: string;
    urlpicture: string;
    token : string;
    badge: string;
    promoActive: boolean;
    factures: Facture[];
    codepromo: any;
    likedislike: any[];
    notes: any[];
    reponses: any[];
    reclamations: any;

    constructor(email:string="",password:string="",badge:string=""){
      this.email = email;
      this.password = password;
      this.badge = badge;
    }
  }
