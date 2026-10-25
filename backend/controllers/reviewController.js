// backend/controllers/reviewController.js
const { db } = require('../config/db');

async function getPublicReviews(req, res, next) {
  try {
    const result = await db.query(
      "SELECT id, customer_name, rating, comment, service_name, created_at FROM reviews WHERE status = 'APPROVED' ORDER BY id DESC"
    );

    // Calculate rating overview
    const statsRes = await db.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE status = 'APPROVED'"
    );

    res.json({
      success: true,
      data: {
        reviews: result.rows,
        summary: {
          averageRating: parseFloat(Number(statsRes.rows[0].avg_rating || 5).toFixed(1)),
          totalReviews: parseInt(statsRes.rows[0].total || 0, 10)
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getAllReviewsAdmin(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM reviews ORDER BY id DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function submitReview(req, res, next) {
  try {
    const { customer_name, rating, comment, service_name } = req.body;
    if (!customer_name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Name, rating, and comment are required.' });
    }

    const cleanRating = Math.max(1, Math.min(5, parseInt(rating, 10)));

    const result = await db.query(
      `INSERT INTO reviews (customer_name, rating, comment, service_name, status)
       VALUES ($1, $2, $3, $4, 'APPROVED') RETURNING *`,
      [customer_name.trim(), cleanRating, comment.trim(), service_name ? service_name.trim() : 'Salon Service']
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function updateReviewStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const valid = ['PENDING', 'APPROVED', 'HIDDEN', 'REJECTED'];
    if (!status || !valid.includes(status.toUpperCase())) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${valid.join(', ')}` });
    }

    const result = await db.query(
      'UPDATE reviews SET status = $1 WHERE id = $2 RETURNING *',
      [status.toUpperCase(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    res.json({
      success: true,
      message: `Review marked as ${status.toUpperCase()}`,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM reviews WHERE id = $1', [id]);
    res.json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPublicReviews,
  getAllReviewsAdmin,
  submitReview,
  updateReviewStatus,
  deleteReview
};
