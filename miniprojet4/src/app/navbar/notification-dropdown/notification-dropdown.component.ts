import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Notification, NotificationType } from '../../Model/Notification';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.css']
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  userId: string = '';
  loading: boolean = false;
  error: string = '';
  isOpen: boolean = false;
  private refreshSubscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.id || '';
    console.log('NotificationDropdown - User ID:', this.userId);
    console.log('NotificationDropdown - Current User:', currentUser);

    if (this.userId) {
      this.loadNotifications();
      this.setupAutoRefresh();
    } else {
      console.error('NotificationDropdown - Aucun ID utilisateur trouvé');
    }

    // S'abonner au compteur de notifications non lues
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
      console.log('NotificationDropdown - Nombre de notifications non lues:', count);
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadNotifications(): void {
    if (!this.userId) {
      console.error('loadNotifications - Aucun ID utilisateur');
      return;
    }

    console.log('loadNotifications - Chargement des notifications pour l\'utilisateur:', this.userId);
    this.loading = true;
    this.error = '';
    this.notificationService.getUserNotifications(this.userId, 1, 5)
      .subscribe({
        next: (response) => {
          console.log('loadNotifications - Réponse reçue:', response);
          this.notifications = response.data || [];
          this.unreadCount = response.unreadCount || 0;
          this.loading = false;
          console.log('loadNotifications - Notifications chargées:', this.notifications.length);
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des notifications: ' + err.message;
          this.loading = false;
          this.notifications = [];
          console.error('Détail de l\'erreur:', err);
        }
      });
  }

  setupAutoRefresh(): void {
    // Rafraîchir les notifications toutes les 60 secondes
    this.refreshSubscription = interval(60000).pipe(
      switchMap(() => this.notificationService.getUnreadCount(this.userId))
    ).subscribe({
      next: (response) => {
        if (this.isOpen) {
          this.loadNotifications();
        }
      },
      error: (err) => {
        console.error('Erreur lors du rafraîchissement des notifications:', err);
      }
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadNotifications();
    }
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    if (!notification._id || notification.isRead) return;

    this.notificationService.markAsRead(notification._id, this.userId)
      .subscribe({
        next: () => {
          notification.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        },
        error: (err) => {
          console.error('Erreur lors du marquage de la notification:', err);
        }
      });
  }

  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead(this.userId)
      .subscribe({
        next: () => {
          this.notifications.forEach(notification => notification.isRead = true);
          this.unreadCount = 0;
        },
        error: (err) => {
          console.error('Erreur lors du marquage des notifications:', err);
        }
      });
  }

  viewAllNotifications(): void {
    this.isOpen = false;
    this.router.navigate(['/preferences/notifications']);
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.REVIEW:
        return 'bi-star';
      case NotificationType.PRODUCT:
        return 'bi-bag';
      case NotificationType.ORDER:
        return 'bi-receipt';
      case NotificationType.PROMOTION:
        return 'bi-tag';
      case NotificationType.SYSTEM:
      default:
        return 'bi-bell';
    }
  }

  getFormattedDate(date: Date): string {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return notifDate.toLocaleDateString();
    }
  }
}
