// backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/authorize');

// Admin protected
router.get('/', authenticate, authorizeAdmin, analyticsController.getDashboardAnalytics);

module.exports = router;
