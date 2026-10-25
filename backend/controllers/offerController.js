// backend/controllers/offerController.js
const { db } = require('../config/db');

async function getAllOffers(req, res, next) {
  try {
    const { activeOnly = 'false' } = req.query;
    let sql = 'SELECT * FROM offers WHERE 1=1';
    const params = [];

    if (activeOnly === 'true') {
      params.push(1);
      sql += ` AND is_active = $${params.length}`;
    }

    sql += ' ORDER BY id DESC';
    const result = await db.query(sql, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function createOffer(req, res, next) {
  try {
    const { title, description, discount_percent, promo_code, start_date, end_date, applicable_services, is_active = 1 } = req.body;
    if (!title || discount_percent === undefined) {
      return res.status(400).json({ success: false, message: 'Title and discount percentage are required.' });
    }

    const result = await db.query(
      `INSERT INTO offers (title, description, discount_percent, promo_code, start_date, end_date, applicable_services, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description || '', parseInt(discount_percent, 10), promo_code || '', start_date || null, end_date || null, applicable_services || '', is_active ? 1 : 0]
    );

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function updateOffer(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, discount_percent, promo_code, start_date, end_date, applicable_services, is_active } = req.body;

    const current = await db.query('SELECT * FROM offers WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Offer not found.' });
    }

    const o = current.rows[0];
    const updatedTitle = title !== undefined ? title : o.title;
    const updatedDesc = description !== undefined ? description : o.description;
    const updatedDisc = discount_percent !== undefined ? parseInt(discount_percent, 10) : o.discount_percent;
    const updatedCode = promo_code !== undefined ? promo_code : o.promo_code;
    const updatedStart = start_date !== undefined ? start_date : o.start_date;
    const updatedEnd = end_date !== undefined ? end_date : o.end_date;
    const updatedApp = applicable_services !== undefined ? applicable_services : o.applicable_services;
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : o.is_active;

    const result = await db.query(
      `UPDATE offers
       SET title = $1, description = $2, discount_percent = $3, promo_code = $4, start_date = $5, end_date = $6, applicable_services = $7, is_active = $8
       WHERE id = $9 RETURNING *`,
      [updatedTitle, updatedDesc, updatedDisc, updatedCode, updatedStart, updatedEnd, updatedApp, updatedActive, id]
    );

    res.json({
      success: true,
      message: 'Offer updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function deleteOffer(req, res, next) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM offers WHERE id = $1', [id]);
    res.json({
      success: true,
      message: 'Offer deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer
};
