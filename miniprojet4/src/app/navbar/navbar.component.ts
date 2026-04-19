import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CategorieProduitService } from '../services/categorie-produit.service';
import { User } from '../Model/user';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow " id="navUser" *ngIf="!isDashboard()">
    <div routerLink="/home"  class="brand-text mx-3 " style="font-weight: bold;" ><img src="assets/img/shop.png"/>
    &nbsp;M<sup>4</sup>E&nbsp;<sub>shop</sub>
     </div>

      <div class="navbar-menu">

        <ng-container *ngIf="isLoggedIn()">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

        <li class="nav-item dropdown" [class.active]="check1" (click)="changeCheck1()" >
        <a class="nav-link " id="navbarDropdownp" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <a>Produit</a>
        </a>
        <ul class="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdownp ">
          <li *ngFor="let cat of listCatP">
            <a class="dropdown-item" style="font-size: medium" [routerLink]="['/products/produit',cat.idCategorieProduit ]">
              <img style="width: 25px ;height: 25px" [src]="cat.categorieProduitIcone" />
              &nbsp;
              {{cat.libelle}}
            </a>
          </li>
        </ul>
      </li>
      <li class="nav-item" >

        <a class="nav-link" [class.active]="checkRec" (click)="changeCheckRec()" routerLink="/reclamations/reclamation">Espace
          Reclamation</a>
      </li>

      <li class="nav-item" >
        <a class="nav-link" [class.active]="check2"  routerLink="/CodePromo/codepromo">Utiliser Code Promo</a>
      </li>


      <li class="nav-item" >
        <a class="fas fa-shopping-cart nav-link" routerLink="/factures/panier"></a>
      </li>
      <li class="nav-item" >
        <a class="far fa-heart nav-link" routerLink="/LikeDislike/LikeDislike"></a>
      </li>

      <li class="nav-item">
        <app-notification-dropdown></app-notification-dropdown>
      </li>

          <a routerLink="/users/profile" class="nav-link">Mon Profil</a>
          <button (click)="logout()" class="nav-link logout-btn">Déconnexion</button>

        </ng-container>
        <ng-container *ngIf="!isLoggedIn()">
          <a routerLink="/users/connexion" class="nav-link">Connexion</a>
          <a routerLink="/users/inscription" class="nav-link">Inscription</a>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`

#navUser {

/*position: fixed;
width: 100%;*/
z-index: 1000;
}
#navMod {
/*position: fixed;
width: 84.2%;*/
z-index: 1000;
}
.nav-link{
  color: black !important;
  opacity: 0.8;
}


.nav-link:hover{
  opacity: 1;
  font-weight: 600;
}
.active{
  opacity: 1;
  font-weight: 600;

}

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #f8f9fa;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar-brand a {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      text-decoration: none;
    }

    .navbar-menu {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-link {
      color: #666;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .nav-link:hover {
      color: #333;
      background-color: rgba(0,0,0,0.05);
    }

    .logout-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }

    .logout-btn:hover {
      color: #dc3545;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 1rem;
      }

      .navbar-menu {
        gap: 0.5rem;
      }

      .nav-link {
        padding: 0.5rem;
      }
    }
  `]
})
export class NavbarComponent {
  data: any;
  user2: User;
  currentUser: any;

  check1: boolean;
  check2: boolean;
  check3: boolean;
  check4: boolean;

  listCatP:any;

  checkRec:boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private  service:CategorieProduitService
  ) {}

  ngOnInit(): void {
    this.service.afficherCategoriesProduit().subscribe((data)=>this.listCatP=data);
    this.user2;
    this.currentUser = this.authService.getCurrentUser();
    this.check1 = true;
    this.check2 = false;
    this.check3 = false;
    this.check4 = false;
    this.checkRec = false;
  }
  changeCheck1() {
    this.check1 = true;
    this.check2 = false;
    this.check3 = false;
    this.check4 = false;
    this.checkRec = false;
  }
  changeCheck2() {
    this.check1 = false;
    this.check2 = true;
    this.check3 = false;
    this.check4 = false;
    this.checkRec = false;
  }
  changeCheck3() {
    this.check1 = false;
    this.check2 = false;
    this.check3 = true;
    this.check4 = false;
    this.checkRec = false;
  }
  changeCheck4() {
    this.check1 = false;
    this.check2 = false;
    this.check3 = false;
    this.check4 = true;
    this.checkRec = false;
  }
  changeCheckRec(){
    this.check1 = false;
    this.check2 = false;
    this.check3 = false;
    this.check4 = false;
    this.checkRec = true;
  }
  isDashboard(): boolean {
    return this.router.url === '/users/dashboard';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/users/connexion']);
  }
}
