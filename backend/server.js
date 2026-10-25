// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const stylistRoutes = require('./routes/stylistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const customerRoutes = require('./routes/customerRoutes');
const offerRoutes = require('./routes/offerRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: true, // Allow client origin
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Groom & Glow API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/stylists', stylistRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler for unknown API routes
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint ${req.originalUrl} not found.`
    });
  }
  res.status(404).send('Not Found');
});

// Centralized error handling
app.use(errorHandler);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Groom & Glow API Server running on port ${PORT}`);
  });
}

module.exports = app;
