const Notification = require('../models/Notification');

/**
 * Service pour gérer les notifications
 */
class NotificationService {
  /**
   * Crée une notification
   * @param {string} userId - ID de l'utilisateur
   * @param {string} title - Titre de la notification
   * @param {string} message - Message de la notification
   * @param {string} type - Type de notification (REVIEW, SYSTEM, PRODUCT, ORDER, PROMOTION)
   * @param {string} relatedId - ID associé (produit, commande, etc.)
   * @returns {Promise<Object>} - La notification créée
   */
  static async createNotification(userId, title, message, type = 'SYSTEM', relatedId = null) {
    try {
      const notification = new Notification({
        userId,
        title,
        message,
        type,
        relatedId
      });

      return await notification.save();
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      throw error;
    }
  }

  /**
   * Crée une notification de type REVIEW
   * @param {string} userId - ID de l'utilisateur
   * @param {string} productId - ID du produit
   * @param {string} reviewId - ID de l'avis
   * @returns {Promise<Object>} - La notification créée
   */
  static async createReviewNotification(userId, productId, reviewId) {
    return this.createNotification(
      userId,
      'Nouvel avis',
      'Un nouvel avis a été ajouté sur un produit que vous suivez',
      'REVIEW',
      reviewId
    );
  }

  /**
   * Crée une notification de type PRODUCT
   * @param {string} userId - ID de l'utilisateur
   * @param {string} productId - ID du produit
   * @param {string} message - Message de la notification
   * @returns {Promise<Object>} - La notification créée
   */
  static async createProductNotification(userId, productId, message) {
    return this.createNotification(
      userId,
      'Mise à jour produit',
      message,
      'PRODUCT',
      productId
    );
  }

  /**
   * Crée une notification de type PROMOTION
   * @param {string} userId - ID de l'utilisateur
   * @param {string} promoId - ID de la promotion
   * @param {string} message - Message de la notification
   * @returns {Promise<Object>} - La notification créée
   */
  static async createPromotionNotification(userId, promoId, message) {
    return this.createNotification(
      userId,
      'Nouvelle promotion',
      message,
      'PROMOTION',
      promoId
    );
  }

  /**
   * Obtient le nombre de notifications non lues pour un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<number>} - Nombre de notifications non lues
   */
  static async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({ userId, isRead: false });
    } catch (error) {
      console.error('Erreur lors du comptage des notifications non lues:', error);
      throw error;
    }
  }

  /**
   * Marque toutes les notifications d'un utilisateur comme lues
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} - Résultat de l'opération
   */
  static async markAllAsRead(userId) {
    try {
      return await Notification.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true } }
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
