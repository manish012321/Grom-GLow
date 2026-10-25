// backend/controllers/stylistController.js
const { db } = require('../config/db');
const { getAvailableSlots } = require('../services/availabilityService');

async function getAllStylists(req, res, next) {
  try {
    const { activeOnly = 'false' } = req.query;
    let sql = 'SELECT * FROM stylists WHERE 1=1';
    const params = [];

    if (activeOnly === 'true') {
      params.push(1);
      sql += ` AND is_active = $${params.length}`;
    }

    sql += ' ORDER BY id ASC';
    const result = await db.query(sql, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function getStylistById(req, res, next) {
  try {
    const { id } = req.params;
    const stylistRes = await db.query('SELECT * FROM stylists WHERE id = $1', [id]);
    if (stylistRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Stylist not found.' });
    }

    const schedulesRes = await db.query(
      'SELECT * FROM stylist_schedules WHERE stylist_id = $1 ORDER BY day_of_week ASC',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...stylistRes.rows[0],
        schedules: schedulesRes.rows
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getStylistSlots(req, res, next) {
  try {
    const { id } = req.params; // stylistId or 'any'
    const { date, duration = 45 } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter (YYYY-MM-DD) is required.' });
    }

    const slots = await getAvailableSlots(id, date, parseInt(duration, 10));

    res.json({
      success: true,
      data: {
        date,
        slots
      }
    });
  } catch (err) {
    next(err);
  }
}

async function createStylist(req, res, next) {
  try {
    const { name, bio, experience_years, specialties, image_url, phone } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Stylist name is required.' });
    }

    const result = await db.query(
      `INSERT INTO stylists (name, bio, experience_years, specialties, image_url, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, 1) RETURNING *`,
      [name, bio || '', experience_years ? parseInt(experience_years, 10) : 5, specialties || '', image_url || '', phone || '']
    );

    const newStylist = result.rows[0];

    // Seed default 7-day schedule (Mon-Sat 09:00-20:00, Sun 10:00-18:00)
    for (let day = 0; day <= 6; day++) {
      const isSunday = day === 0;
      await db.query(
        `INSERT INTO stylist_schedules (stylist_id, day_of_week, start_time, end_time, break_start, break_end, is_day_off)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [newStylist.id, day, isSunday ? '10:00' : '09:00', isSunday ? '18:00' : '20:00', '13:00', '14:00', 0]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Stylist created successfully',
      data: newStylist
    });
  } catch (err) {
    next(err);
  }
}

async function updateStylist(req, res, next) {
  try {
    const { id } = req.params;
    const { name, bio, experience_years, specialties, image_url, phone, is_active } = req.body;

    const current = await db.query('SELECT * FROM stylists WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Stylist not found.' });
    }

    const st = current.rows[0];
    const updatedName = name !== undefined ? name : st.name;
    const updatedBio = bio !== undefined ? bio : st.bio;
    const updatedExp = experience_years !== undefined ? parseInt(experience_years, 10) : st.experience_years;
    const updatedSpec = specialties !== undefined ? specialties : st.specialties;
    const updatedImg = image_url !== undefined ? image_url : st.image_url;
    const updatedPhone = phone !== undefined ? phone : st.phone;
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : st.is_active;

    const result = await db.query(
      `UPDATE stylists
       SET name = $1, bio = $2, experience_years = $3, specialties = $4, image_url = $5, phone = $6, is_active = $7
       WHERE id = $8 RETURNING *`,
      [updatedName, updatedBio, updatedExp, updatedSpec, updatedImg, updatedPhone, updatedActive, id]
    );

    res.json({
      success: true,
      message: 'Stylist updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function updateSchedule(req, res, next) {
  try {
    const { id } = req.params;
    const { schedules } = req.body; // Array of 7 day schedule objects

    if (!Array.isArray(schedules)) {
      return res.status(400).json({ success: false, message: 'Schedules array is required.' });
    }

    for (const s of schedules) {
      await db.query(
        `UPDATE stylist_schedules
         SET start_time = $1, end_time = $2, break_start = $3, break_end = $4, is_day_off = $5
         WHERE stylist_id = $6 AND day_of_week = $7`,
        [s.start_time, s.end_time, s.break_start, s.break_end, s.is_day_off ? 1 : 0, id, s.day_of_week]
      );
    }

    res.json({
      success: true,
      message: 'Stylist schedule updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

async function deleteStylist(req, res, next) {
  try {
    const { id } = req.params;
    // Check appointments
    const appCheck = await db.query('SELECT COUNT(*) as count FROM appointments WHERE stylist_id = $1', [id]);
    if (parseInt(appCheck.rows[0].count, 10) > 0) {
      await db.query('UPDATE stylists SET is_active = 0 WHERE id = $1', [id]);
      return res.json({
        success: true,
        message: 'Stylist has existing appointment records. Marked as inactive.'
      });
    }

    await db.query('DELETE FROM stylists WHERE id = $1', [id]);
    res.json({
      success: true,
      message: 'Stylist deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllStylists,
  getStylistById,
  getStylistSlots,
  createStylist,
  updateStylist,
  updateSchedule,
  deleteStylist
};
