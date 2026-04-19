const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route pour créer une nouvelle notification
router.post('/', notificationController.createNotification);

// Route pour obtenir toutes les notifications d'un utilisateur
router.get('/user/:userId', notificationController.getUserNotifications);

// Route pour obtenir le nombre de notifications non lues pour un utilisateur
router.get('/user/:userId/unread-count', notificationController.getUnreadCount);

// Route pour marquer une notification comme lue
router.put('/:id/read', notificationController.markAsRead);

// Route pour marquer toutes les notifications d'un utilisateur comme lues
router.put('/user/:userId/read-all', notificationController.markAllAsRead);

// Route pour supprimer une notification
router.delete('/:id', notificationController.deleteNotification);

// Route pour supprimer toutes les notifications d'un utilisateur
router.delete('/user/:userId/all', notificationController.deleteAllUserNotifications);

module.exports = router;
