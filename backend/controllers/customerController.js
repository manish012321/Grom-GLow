// backend/controllers/customerController.js
const { db } = require('../config/db');

async function getAllCustomers(req, res, next) {
  try {
    const { search, sortBy = 'total_spent', order = 'DESC' } = req.query;
    let sql = 'SELECT * FROM customers WHERE 1=1';
    const params = [];

    if (search) {
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
      const p1 = params.length - 2;
      const p2 = params.length - 1;
      const p3 = params.length;
      sql += ` AND (LOWER(name) LIKE $${p1} OR LOWER(phone) LIKE $${p2} OR LOWER(email) LIKE $${p3})`;
    }

    const validSorts = ['name', 'total_visits', 'total_spent', 'created_at'];
    const safeSort = validSorts.includes(sortBy) ? sortBy : 'total_spent';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${safeSort} ${safeOrder}`;
    const result = await db.query(sql, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const { id } = req.params;
    const custRes = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (custRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    // Get appointment history
    const historyRes = await db.query(
      `SELECT a.*, s.name as service_name, s.price as service_price, st.name as stylist_name
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       JOIN stylists st ON a.stylist_id = st.id
       WHERE a.customer_id = $1
       ORDER BY a.date DESC, a.start_time DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...custRes.rows[0],
        appointments: historyRes.rows
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById
};
