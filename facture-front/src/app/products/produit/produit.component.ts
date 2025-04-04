import { Component, OnInit } from '@angular/core';
import {SessionService} from "../../services/session.service";
import {ProduitService} from "../../services/produit.service";
import {ActivatedRoute, NavigationStart} from "@angular/router";
import {Produit} from "../../Model/Produit";
import {NotifierModule, NotifierService} from "angular-notifier";
import {User} from "../../Model/user";
import {Observable} from "rxjs";

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {

  listProduit:any
  listProduitFront:any
  showFormTemplate:boolean
  inputProduct: Produit;
  ProductInsideList:boolean=false;
  notifcounter=0;

  private readonly notifier: NotifierService;

  constructor(private route: ActivatedRoute,private service:ProduitService,private session:SessionService,    notifierService: NotifierService) {
    this.notifier = notifierService;

  }
  ngOnInit(): void {
    this.showFormTemplate = false;

    // Produits statiques pour le test
    this.listProduit = [
      {
        idProduit: 1,
        code: "P001",
        libelle: "Produit Test 1",
        dateCreation: "2024-03-20",
        dateDerniereModification: "2024-03-22",
        prixUnitaire: 100,
        imageProduit: "https://via.placeholder.com/100",
        quantiteEnStock: 10,
        pourcentageRemise: 5,
        categorieProduit: { libelle: "Catégorie A", categorieProduitIcone: "https://via.placeholder.com/20" },
        moyenneNote: 4
      },
      {
        idProduit: 2,
        code: "P002",
        libelle: "Produit Test 2",
        dateCreation: "2024-03-18",
        dateDerniereModification: "2024-03-21",
        prixUnitaire: 150,
        imageProduit: "https://via.placeholder.com/100",
        quantiteEnStock: 5,
        pourcentageRemise: 10,
        categorieProduit: { libelle: "Catégorie B", categorieProduitIcone: "https://via.placeholder.com/20" },
        moyenneNote: 3
      }
    ];

    // Produits statiques pour l'affichage Front
    this.listProduitFront = this.listProduit;

  }





  supprimerProd(id: number){
    let resp= this.service.supprimerProduit(id).subscribe(()=>{
      this.service.afficherProduit().subscribe((data)=>{this.listProduit=data;})
    });
  }


  updateRate(p:Produit)
  {  //let note = p.note;
  //   let pr=p;

  //   note.produit=pr;
  //   note.produit.note.noteproduit=4;




  //   this.route.paramMap.subscribe((params) => {
  //     this.noteservice.saveNote(note).subscribe();
  //     let resp1 = this.service.afficherProduitByCat(params.get('categoryid'), this.getUser().toString())
  //       .subscribe((data) => {
  //           this.listProduitFront = data;
  //         }
  //       );
  //   });





  }
  saveProduct(p: Produit){
    let resp= this.service.ajouterProduit(p).subscribe(()=>{
      this.service.afficherProduit().subscribe((data)=>{this.listProduit=data;})
    });
    this.showFormTemplate=false;
  }

  getUserType(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user.badge);  // Vérifiez la valeur retournée
    return user.badge;
  }

  getUser():number{
    const user = this.session.getUser();
    return user ? user.idUser : 0; // Return 0 or handle the null case appropriately
  }

  showForm()
  {if (this.showFormTemplate===true)
    this.showFormTemplate=false;
  else this.showFormTemplate=true;
  }

  updateForm(p:Produit)
  {if (this.showFormTemplate===true)
    this.showFormTemplate=false;
  else this.showFormTemplate=true;
    this.inputProduct=p;
  }

  ajouterPanier(p:Produit){
    this.session.addToPanier(p,1);
    this.notifier.notify('info', 'vous pouvez maintenant visiter votre panier \n');
    this.notifcounter++;
    if(this.notifcounter==3){
      this.notifier.hideOldest();
    }
  }
  ProductInsidePanier(p:Produit):boolean{
    return this.session.getPanier().findIndex((e)=>e.produit.idProduit==p.idProduit)!=-1;
  }
  getUserr():User{
    const user = this.session.getUser();
    if (!user) {
      throw new Error('User is not logged in');
    }
    return user;
  }


  wish(p:Produit){
    // let like= new LikeDislike(0,this.getUserr(),p);
    // p.valeur=true;
    // let resp= this.service.ajouterProduit(p).subscribe();

    // this.LikeDislikeService.saveLikeDislike(like).subscribe();
    // this.notifier.notify('info', 'Article '+p.libelle+' est ajouté à la liste des favoris  \n');
    // this.notifcounter++;
    // if(this.notifcounter==3){
    //   this.notifier.hideOldest();
    // }
  }



}
