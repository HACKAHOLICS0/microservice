import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  email: string;
  message: string;
  role: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8084';
  private tokenKey = 'token';
  private emailKey = 'email';
  private roleKey = 'role';
  private userEmail = new BehaviorSubject<string | null>(localStorage.getItem(this.emailKey));
  private isAuthenticated = new BehaviorSubject<boolean>(this.checkInitialAuth());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('Pas de token dans le localStorage');
      return false;
    }

    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      const isValid = decoded.exp > currentTime;
      console.log('Token valide:', isValid);
      return isValid;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      this.clearAuthData();
      return false;
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private clearAuthData(): void {
    console.log('Nettoyage des données d\'authentification');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    localStorage.removeItem(this.roleKey);
    this.userEmail.next(null);
    this.isAuthenticated.next(false);
  }

  logout(): void {
    console.log('Déconnexion...');
    this.clearAuthData();
    this.router.navigate(['/users/connexion']);
  }

  register(userData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/auth/register`, userData, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur d\'inscription:', error);
          return throwError(() => error);
        })
      );
  }

  private decodeToken(token: string): JwtPayload {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Token décodé avec succès:', decoded);

      let role = decoded.role;

      if (!role && decoded.realm_access?.roles) {
        role = decoded.realm_access.roles.includes('ADMIN') ? 'ADMIN' : 'USER';
      }

      if (!role && decoded.resource_access) {
        const resourceRoles = Object.values(decoded.resource_access)
          .map((resource: { roles?: string[] }) => resource.roles || [])
          .reduce((acc: string[], curr: string[]) => [...acc, ...curr], []);
        role = resourceRoles.includes('ADMIN') ? 'ADMIN' : 'USER';
      }

      if (role) {
        localStorage.setItem(this.roleKey, role);
      }

      // Vérifier si l'ID utilisateur (sub) est présent
      if (!decoded.sub) {
        console.error('Attention: Le token ne contient pas d\'ID utilisateur (sub)');
      } else {
        console.log('ID utilisateur (sub) trouvé dans le token:', decoded.sub);
      }

      return decoded;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      throw error;
    }
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      email: email,
      password: password
    };

    console.log('Tentative de connexion avec:', { email, headers: headers.keys() });

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, body, { headers })
      .pipe(
        tap((response: AuthResponse) => {
          console.log('Réponse de connexion:', response);
          if (response && response.token) {
            console.log('Login réussi, sauvegarde du token');
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.emailKey, response.email);
            localStorage.setItem(this.roleKey, response.role || 'USER');
            this.userEmail.next(response.email);
            this.isAuthenticated.next(true);

            // Décoder le token et récupérer l'ID utilisateur
            const decoded = this.decodeToken(response.token);

            // Créer une notification de connexion avec l'ID utilisateur du token
            if (decoded && decoded.sub) {
              this.createLoginNotification(decoded.sub);
            } else {
              console.error('Impossible de créer une notification: ID utilisateur non trouvé dans le token');
            }

            if (this.isAdmin()) {
              this.router.navigate(['/users/dashboard']);
            } else {
              this.router.navigate(['/home']);
            }
          }
        }),
        catchError(error => {
          console.error('Erreur de connexion:', error);
          let errorMessage = 'Une erreur est survenue lors de la connexion';

          if (error.status === 401) {
            errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 403) {
            errorMessage = 'Accès refusé';
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  isLoggedIn(): boolean {
    const isAuth = this.isAuthenticated.value;
    console.log('État de connexion:', isAuth);
    return isAuth && this.checkInitialAuth();
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      console.log('Token récupéré du localStorage');
    } else {
      console.log('Pas de token dans le localStorage');
    }
    return token;
  }

  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  getUserEmail(): Observable<string | null> {
    return this.userEmail.asObservable();
  }

  updateUserEmail(newEmail: string): void {
    localStorage.setItem(this.emailKey, newEmail);
    this.userEmail.next(newEmail);
  }

  isAdmin(): boolean {
    const role = localStorage.getItem(this.roleKey);
    const token = this.getToken();

    if (token) {
      try {
        const decoded = this.decodeToken(token);
        return role === 'ADMIN' ||
               decoded.realm_access?.roles.includes('ADMIN') ||
               Object.values(decoded.resource_access || {}).some(r => r.roles?.includes('ADMIN'));
      } catch (error) {
        console.error('Erreur lors de la vérification du rôle admin:', error);
        return false;
      }
    }

    return role === 'ADMIN';
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  updateUser(userData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`http://localhost:8084/api/users/profile`, userData, {
      headers,
      withCredentials: true // ⚠️ obligatoire ici
    })
    .pipe(
      tap((response: any) => {
        if (userData.email) {
          this.updateUserEmail(userData.email);
        }
      }),
      catchError(error => {
        console.error('Erreur de mise à jour du profil utilisateur:', error);
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): any {
    const token = this.getToken();
    const email = this.getEmail();
    const role = this.getRole();

    if (!token || !email) {
      return null;
    }

    try {
      const decoded = this.decodeToken(token);
      return {
        id: decoded.sub,
        email: email,
        role: role || 'USER',
        username: email.split('@')[0] // Utiliser la partie avant @ comme nom d'utilisateur par défaut
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      return null;
    }
  }

  /**
   * Crée une notification de connexion pour l'utilisateur
   * @param userId ID de l'utilisateur
   */
  private createLoginNotification(userId: string | undefined): void {
    if (!userId) {
      console.error('createLoginNotification - Impossible de créer une notification: userId est undefined');
      return;
    }

    console.log('createLoginNotification - Création d\'une notification pour userId:', userId);

    // Importer HttpClient et NotificationService ici pourrait créer une dépendance circulaire
    // Donc on utilise directement HttpClient
    const apiUrl = environment.apiUrl + '/api/notifications';
    const notification = {
      userId: userId,
      title: 'Bienvenue',
      message: 'Bienvenue sur notre plateforme!',
      type: 'SYSTEM'
    };

    console.log('createLoginNotification - Envoi de la notification:', notification);

    this.http.post(apiUrl, notification).subscribe({
      next: (response) => console.log('Notification de connexion créée:', response),
      error: (err) => console.error('Erreur lors de la création de la notification:', err)
    });
  }
}
