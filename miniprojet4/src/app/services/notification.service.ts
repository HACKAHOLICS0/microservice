import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Notification, NotificationType } from '../Model/Notification';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl + '/api/notifications';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur s\'est produite:', error);
    let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  // Récupérer toutes les notifications d'un utilisateur
  getUserNotifications(userId: string, page: number = 1, limit: number = 10, unreadOnly: boolean = false): Observable<any> {
    if (!userId) {
      console.error('getUserNotifications - userId est vide');
      return throwError(() => new Error('ID utilisateur requis'));
    }

    console.log('getUserNotifications - Appel API pour userId:', userId);
    const url = `${this.apiUrl}/user/${userId}?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`;

    return this.http.get<any>(url).pipe(
      tap(response => {
        console.log('getUserNotifications - Réponse API:', response);
        if (response.unreadCount !== undefined) {
          this.unreadCountSubject.next(response.unreadCount);
        }
      }),
      catchError(error => {
        console.error('getUserNotifications - Erreur:', error);
        return this.handleError(error);
      })
    );
  }

  // Récupérer le nombre de notifications non lues
  getUnreadCount(userId: string): Observable<any> {
    const url = `${this.apiUrl}/user/${userId}/unread-count`;
    return this.http.get<any>(url).pipe(
      tap(response => {
        if (response.unreadCount !== undefined) {
          this.unreadCountSubject.next(response.unreadCount);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Créer une nouvelle notification
  createNotification(notification: Notification): Observable<any> {
    return this.http.post<any>(this.apiUrl, notification).pipe(
      catchError(this.handleError)
    );
  }

  // Marquer une notification comme lue
  markAsRead(notificationId: string, userId: string): Observable<any> {
    const url = `${this.apiUrl}/${notificationId}/read`;
    return this.http.put<any>(url, { userId }).pipe(
      tap(() => {
        // Mettre à jour le compteur de notifications non lues
        const currentCount = this.unreadCountSubject.value;
        if (currentCount > 0) {
          this.unreadCountSubject.next(currentCount - 1);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Marquer toutes les notifications d'un utilisateur comme lues
  markAllAsRead(userId: string): Observable<any> {
    const url = `${this.apiUrl}/user/${userId}/read-all`;
    return this.http.put<any>(url, { userId }).pipe(
      tap(() => {
        // Réinitialiser le compteur de notifications non lues
        this.unreadCountSubject.next(0);
      }),
      catchError(this.handleError)
    );
  }

  // Supprimer une notification
  deleteNotification(notificationId: string, userId: string, role: string = 'user'): Observable<any> {
    const url = `${this.apiUrl}/${notificationId}`;
    return this.http.delete<any>(url, { body: { userId, role } }).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer toutes les notifications d'un utilisateur
  deleteAllUserNotifications(userId: string, role: string = 'user'): Observable<any> {
    const url = `${this.apiUrl}/user/${userId}/all`;
    return this.http.delete<any>(url, { body: { userId, role } }).pipe(
      catchError(this.handleError)
    );
  }

  // Créer une notification système (utilitaire)
  createSystemNotification(userId: string, title: string, message: string): Observable<any> {
    const notification = new Notification(
      userId,
      title,
      message,
      NotificationType.SYSTEM
    );
    return this.createNotification(notification);
  }

  // Créer une notification de produit (utilitaire)
  createProductNotification(userId: string, title: string, message: string, productId: string): Observable<any> {
    const notification = new Notification(
      userId,
      title,
      message,
      NotificationType.PRODUCT,
      false,
      productId
    );
    return this.createNotification(notification);
  }

  // Créer une notification de commande (utilitaire)
  createOrderNotification(userId: string, title: string, message: string, orderId: string): Observable<any> {
    const notification = new Notification(
      userId,
      title,
      message,
      NotificationType.ORDER,
      false,
      orderId
    );
    return this.createNotification(notification);
  }

  // Mettre à jour manuellement le compteur de notifications non lues
  updateUnreadCount(count: number): void {
    this.unreadCountSubject.next(count);
  }
}
