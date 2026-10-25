// backend/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/authorize');
const { validateBooking } = require('../middleware/validation');

// Public customer booking
router.post('/', validateBooking, appointmentController.createAppointment);
router.post('/:id/cancel', appointmentController.cancelAppointment);
router.get('/:id', appointmentController.getAppointmentById);

// Admin protected
router.get('/', authenticate, authorizeAdmin, appointmentController.getAllAppointments);
router.patch('/:id/status', authenticate, authorizeAdmin, appointmentController.updateAppointmentStatus);

module.exports = router;
