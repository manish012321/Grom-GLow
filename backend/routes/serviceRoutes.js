// backend/routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/authorize');
const { validateService } = require('../middleware/validation');

// Public
router.get('/', serviceController.getAllServices);
router.get('/:slug', serviceController.getServiceBySlug);

// Admin protected
router.post('/', authenticate, authorizeAdmin, validateService, serviceController.createService);
router.patch('/:id', authenticate, authorizeAdmin, serviceController.updateService);
router.delete('/:id', authenticate, authorizeAdmin, serviceController.deleteService);

module.exports = router;
