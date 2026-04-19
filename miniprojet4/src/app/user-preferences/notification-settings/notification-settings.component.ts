import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification, NotificationType } from '../../Model/Notification';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {
  notifications: Notification[] = [];
  userId: string = '';
  loading: boolean = false;
  error: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  unreadOnly: boolean = false;
  notificationTypes = NotificationType;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.id || '';
    console.log('NotificationSettings - User ID:', this.userId);
    console.log('NotificationSettings - Current User:', currentUser);

    if (this.userId) {
      this.loadNotifications();
    } else {
      this.error = 'Utilisateur non connecté';
      console.error('NotificationSettings - Aucun ID utilisateur trouvé');
    }
  }

  loadNotifications(): void {
    this.loading = true;
    this.error = '';
    console.log('NotificationSettings - Chargement des notifications pour l\'utilisateur:', this.userId);

    this.notificationService.getUserNotifications(this.userId, this.currentPage, 10, this.unreadOnly)
      .subscribe({
        next: (response) => {
          console.log('NotificationSettings - Réponse reçue:', response);
          this.notifications = response.data || [];
          this.totalPages = response.totalPages || 1;
          this.loading = false;
          console.log('NotificationSettings - Notifications chargées:', this.notifications.length);
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des notifications: ' + err.message;
          this.loading = false;
          this.notifications = [];
          console.error('Détail de l\'erreur:', err);
        }
      });
  }

  markAsRead(notification: Notification): void {
    if (!notification._id || notification.isRead) return;

    this.notificationService.markAsRead(notification._id, this.userId)
      .subscribe({
        next: () => {
          notification.isRead = true;
        },
        error: (err) => {
          this.error = 'Erreur lors du marquage de la notification: ' + err.message;
        }
      });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead(this.userId)
      .subscribe({
        next: () => {
          this.notifications.forEach(notification => notification.isRead = true);
        },
        error: (err) => {
          this.error = 'Erreur lors du marquage des notifications: ' + err.message;
        }
      });
  }

  deleteNotification(notification: Notification): void {
    if (!notification._id) return;

    this.notificationService.deleteNotification(notification._id, this.userId)
      .subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n._id !== notification._id);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de la notification: ' + err.message;
        }
      });
  }

  deleteAllNotifications(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes vos notifications?')) {
      this.notificationService.deleteAllUserNotifications(this.userId)
        .subscribe({
          next: () => {
            this.notifications = [];
          },
          error: (err) => {
            this.error = 'Erreur lors de la suppression des notifications: ' + err.message;
          }
        });
    }
  }

  toggleUnreadOnly(): void {
    this.unreadOnly = !this.unreadOnly;
    this.currentPage = 1;
    this.loadNotifications();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadNotifications();
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.REVIEW:
        return 'star';
      case NotificationType.PRODUCT:
        return 'shopping_bag';
      case NotificationType.ORDER:
        return 'receipt';
      case NotificationType.PROMOTION:
        return 'local_offer';
      case NotificationType.SYSTEM:
      default:
        return 'notifications';
    }
  }

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
