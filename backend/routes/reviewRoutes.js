// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/authorize');

// Public
router.get('/', reviewController.getPublicReviews);
router.post('/', reviewController.submitReview);

// Admin protected
router.get('/admin', authenticate, authorizeAdmin, reviewController.getAllReviewsAdmin);
router.patch('/:id/status', authenticate, authorizeAdmin, reviewController.updateReviewStatus);
router.delete('/:id', authenticate, authorizeAdmin, reviewController.deleteReview);

module.exports = router;
