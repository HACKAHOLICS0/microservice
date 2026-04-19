const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Route pour créer un nouvel avis
router.post('/', reviewController.createReview);

// Route pour obtenir tous les avis d'un produit
router.get('/product/:productId', reviewController.getReviewsByProduct);

// Route pour obtenir le résumé des évaluations d'un produit
router.get('/summary/:productId', reviewController.getProductRatingSummary);

// Route pour obtenir un avis spécifique
router.get('/:id', reviewController.getReview);

// Route pour mettre à jour un avis
router.put('/:id', reviewController.updateReview);

// Route pour supprimer un avis
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
