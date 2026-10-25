// backend/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticate } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/authorize');

// Admin protected
router.get('/', authenticate, authorizeAdmin, customerController.getAllCustomers);
router.get('/:id', authenticate, authorizeAdmin, customerController.getCustomerById);

module.exports = router;
