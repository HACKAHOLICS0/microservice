const Review = require('../models/Review');
const NotificationService = require('../services/notificationService');

// Créer un nouvel avis
exports.createReview = async (req, res) => {
  try {
    const { productId, userId, rating, title, comment, isVerifiedPurchase } = req.body;

    // Validation des données
    if (!productId || !userId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires'
      });
    }

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour ce produit'
      });
    }

    // Créer le nouvel avis
    const review = new Review({
      productId,
      userId,
      rating,
      title,
      comment,
      isVerifiedPurchase: isVerifiedPurchase || false
    });

    const savedReview = await review.save();

    // Créer une notification pour le propriétaire du produit (simulation)
    // Dans un cas réel, vous récupéreriez l'ID du propriétaire du produit
    try {
      // Simulons que le propriétaire du produit a l'ID "owner123"
      const ownerId = "owner123";
      await NotificationService.createNotification(
        ownerId,
        "Nouvel avis sur votre produit",
        `Un nouvel avis a été ajouté sur votre produit: ${title}`,
        "REVIEW",
        savedReview._id
      );
    } catch (notifError) {
      console.error("Erreur lors de la création de la notification:", notifError);
      // Ne pas bloquer la création de l'avis si la notification échoue
    }

    res.status(201).json({
      success: true,
      data: savedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'avis',
      error: error.message
    });
  }
};

// Obtenir tous les avis pour un produit
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const reviews = await Review.find({ productId })
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalReviews = await Review.countDocuments({ productId });

    res.status(200).json({
      success: true,
      count: reviews.length,
      totalPages: Math.ceil(totalReviews / parseInt(limit)),
      currentPage: parseInt(page),
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des avis',
      error: error.message
    });
  }
};

// Obtenir un avis spécifique
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'avis',
      error: error.message
    });
  }
};

// Mettre à jour un avis
exports.updateReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Vérifier si l'utilisateur est le propriétaire de l'avis
    if (review.userId !== req.body.userId) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cet avis'
      });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.updatedAt = Date.now();

    const updatedReview = await review.save();

    res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'avis',
      error: error.message
    });
  }
};

// Supprimer un avis
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Vérifier si l'utilisateur est le propriétaire de l'avis ou un admin
    if (review.userId !== req.body.userId && req.body.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cet avis'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Avis supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'avis',
      error: error.message
    });
  }
};

// Obtenir le résumé des évaluations pour un produit
exports.getProductRatingSummary = async (req, res) => {
  try {
    const { productId } = req.params;

    // Calculer la note moyenne
    const result = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          fiveStars: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          fourStars: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          threeStars: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          twoStars: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          oneStar: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          productId,
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {
            fiveStars: 0,
            fourStars: 0,
            threeStars: 0,
            twoStars: 0,
            oneStar: 0
          }
        }
      });
    }

    const summary = result[0];
    
    res.status(200).json({
      success: true,
      data: {
        productId,
        averageRating: Math.round(summary.averageRating * 10) / 10,
        totalReviews: summary.totalReviews,
        ratingDistribution: {
          fiveStars: summary.fiveStars,
          fourStars: summary.fourStars,
          threeStars: summary.threeStars,
          twoStars: summary.twoStars,
          oneStar: summary.oneStar
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du résumé des évaluations',
      error: error.message
    });
  }
};
