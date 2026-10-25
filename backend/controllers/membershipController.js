// backend/controllers/membershipController.js
const { db } = require('../config/db');

async function getAllMemberships(req, res, next) {
  try {
    const { activeOnly = 'false' } = req.query;
    let sql = 'SELECT * FROM memberships WHERE 1=1';
    const params = [];

    if (activeOnly === 'true') {
      params.push(1);
      sql += ` AND is_active = $${params.length}`;
    }

    sql += ' ORDER BY price ASC';
    const result = await db.query(sql, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function createMembership(req, res, next) {
  try {
    const { name, price, duration_months, benefits, discount_percent = 10, is_active = 1 } = req.body;
    if (!name || price === undefined || !duration_months) {
      return res.status(400).json({ success: false, message: 'Name, price, and duration are required.' });
    }

    const result = await db.query(
      `INSERT INTO memberships (name, price, duration_months, benefits, discount_percent, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, Number(price), parseInt(duration_months, 10), benefits || '', parseInt(discount_percent, 10), is_active ? 1 : 0]
    );

    res.status(201).json({
      success: true,
      message: 'Membership created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function updateMembership(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price, duration_months, benefits, discount_percent, is_active } = req.body;

    const current = await db.query('SELECT * FROM memberships WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Membership tier not found.' });
    }

    const m = current.rows[0];
    const updatedName = name !== undefined ? name : m.name;
    const updatedPrice = price !== undefined ? Number(price) : m.price;
    const updatedDur = duration_months !== undefined ? parseInt(duration_months, 10) : m.duration_months;
    const updatedBen = benefits !== undefined ? benefits : m.benefits;
    const updatedDisc = discount_percent !== undefined ? parseInt(discount_percent, 10) : m.discount_percent;
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : m.is_active;

    const result = await db.query(
      `UPDATE memberships
       SET name = $1, price = $2, duration_months = $3, benefits = $4, discount_percent = $5, is_active = $6
       WHERE id = $7 RETURNING *`,
      [updatedName, updatedPrice, updatedDur, updatedBen, updatedDisc, updatedActive, id]
    );

    res.json({
      success: true,
      message: 'Membership updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function deleteMembership(req, res, next) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM memberships WHERE id = $1', [id]);
    res.json({
      success: true,
      message: 'Membership tier deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllMemberships,
  createMembership,
  updateMembership,
  deleteMembership
};
