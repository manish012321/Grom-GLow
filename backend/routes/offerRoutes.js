// backend/routes/offerRoutes.js
const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticate } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/authorize');

// Public
router.get('/', offerController.getAllOffers);

// Admin protected
router.post('/', authenticate, authorizeAdmin, offerController.createOffer);
router.patch('/:id', authenticate, authorizeAdmin, offerController.updateOffer);
router.delete('/:id', authenticate, authorizeAdmin, offerController.deleteOffer);

module.exports = router;
