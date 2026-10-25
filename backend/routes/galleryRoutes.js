// backend/routes/galleryRoutes.js
const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticate } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/authorize');

// Public
router.get('/', galleryController.getGalleryItems);

// Admin protected
router.get('/admin', authenticate, authorizeAdmin, galleryController.getAllGalleryAdmin);
router.post('/', authenticate, authorizeAdmin, galleryController.createGalleryItem);
router.delete('/:id', authenticate, authorizeAdmin, galleryController.deleteGalleryItem);

module.exports = router;
