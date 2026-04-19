const Notification = require('../models/Notification');

// Créer une nouvelle notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, relatedId } = req.body;

    // Validation des données
    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Les champs userId, title et message sont obligatoires'
      });
    }

    // Créer la notification
    const notification = new Notification({
      userId,
      title,
      message,
      type: type || 'SYSTEM',
      relatedId: relatedId || null
    });

    const savedNotification = await notification.save();

    res.status(201).json({
      success: true,
      data: savedNotification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la notification',
      error: error.message
    });
  }
};

// Obtenir toutes les notifications d'un utilisateur
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, unreadOnly = false } = req.query;

    const query = { userId };
    
    // Filtrer par notifications non lues si demandé
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalNotifications = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      count: notifications.length,
      totalPages: Math.ceil(totalNotifications / parseInt(limit)),
      currentPage: parseInt(page),
      unreadCount: await Notification.countDocuments({ userId, isRead: false }),
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications',
      error: error.message
    });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    // Vérifier si l'utilisateur est le propriétaire de la notification
    if (notification.userId !== req.body.userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette notification'
      });
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();

    res.status(200).json({
      success: true,
      data: updatedNotification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la notification',
      error: error.message
    });
  }
};

// Marquer toutes les notifications d'un utilisateur comme lues
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marquées comme lues`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des notifications',
      error: error.message
    });
  }
};

// Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    // Vérifier si l'utilisateur est le propriétaire de la notification ou un admin
    if (notification.userId !== req.body.userId && req.body.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette notification'
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la notification',
      error: error.message
    });
  }
};

// Supprimer toutes les notifications d'un utilisateur
exports.deleteAllUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Vérifier si l'utilisateur est autorisé
    if (userId !== req.body.userId && req.body.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ces notifications'
      });
    }

    const result = await Notification.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications supprimées`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression des notifications',
      error: error.message
    });
  }
};

// Obtenir le nombre de notifications non lues pour un utilisateur
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du nombre de notifications non lues',
      error: error.message
    });
  }
};

// Créer une notification système (utilitaire interne)
exports.createSystemNotification = async (userId, title, message, relatedId = null) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type: 'SYSTEM',
      relatedId
    });

    return await notification.save();
  } catch (error) {
    console.error('Erreur lors de la création de la notification système:', error);
    return null;
  }
};
