// backend/routes/membershipRoutes.js
const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { authenticate } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/authorize');

// Public
router.get('/', membershipController.getAllMemberships);

// Admin protected
router.post('/', authenticate, authorizeAdmin, membershipController.createMembership);
router.patch('/:id', authenticate, authorizeAdmin, membershipController.updateMembership);
router.delete('/:id', authenticate, authorizeAdmin, membershipController.deleteMembership);

module.exports = router;
