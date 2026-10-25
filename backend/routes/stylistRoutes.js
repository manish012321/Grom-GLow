// backend/routes/stylistRoutes.js
const express = require('express');
const router = express.Router();
const stylistController = require('../controllers/stylistController');
const { authenticate } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/authorize');

// Public
router.get('/', stylistController.getAllStylists);
router.get('/:id', stylistController.getStylistById);
router.get('/:id/slots', stylistController.getStylistSlots);

// Admin protected
router.post('/', authenticate, authorizeAdmin, stylistController.createStylist);
router.patch('/:id', authenticate, authorizeAdmin, stylistController.updateStylist);
router.patch('/:id/schedule', authenticate, authorizeAdmin, stylistController.updateSchedule);
router.delete('/:id', authenticate, authorizeAdmin, stylistController.deleteStylist);

module.exports = router;
