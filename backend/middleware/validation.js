// backend/middleware/validation.js

function validateBooking(req, res, next) {
  const { serviceId, date, startTime, customer } = req.body;

  if (!serviceId) {
    return res.status(400).json({ success: false, message: 'Please select a service.' });
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ success: false, message: 'A valid appointment date (YYYY-MM-DD) is required.' });
  }

  if (!startTime || !/^\d{2}:\d{2}$/.test(startTime)) {
    return res.status(400).json({ success: false, message: 'A valid start time (HH:MM) is required.' });
  }

  if (!customer || !customer.name || !customer.phone) {
    return res.status(400).json({ success: false, message: 'Customer name and phone number are required.' });
  }

  // Basic phone validation (min 8 digits)
  const phoneClean = customer.phone.replace(/[^0-9]/g, '');
  if (phoneClean.length < 8) {
    return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });
  }

  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  next();
}

function validateService(req, res, next) {
  const { name, category, price, duration_min } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Service name is required.' });
  }
  if (!category) {
    return res.status(400).json({ success: false, message: 'Category is required.' });
  }
  if (price === undefined || isNaN(price) || Number(price) < 0) {
    return res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
  }
  if (!duration_min || isNaN(duration_min) || Number(duration_min) <= 0) {
    return res.status(400).json({ success: false, message: 'Duration must be a positive number of minutes.' });
  }
  next();
}

module.exports = {
  validateBooking,
  validateService
};
