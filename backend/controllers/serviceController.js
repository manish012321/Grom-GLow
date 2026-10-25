// backend/controllers/serviceController.js
const { db } = require('../config/db');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function getAllServices(req, res, next) {
  try {
    const { category, gender, activeOnly = 'false' } = req.query;
    let sql = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (activeOnly === 'true') {
      params.push(1);
      sql += ` AND is_active = $${params.length}`;
    }

    if (category && category !== 'ALL') {
      params.push(category.toUpperCase());
      sql += ` AND category = $${params.length}`;
    }

    if (gender && gender !== 'ALL') {
      params.push(gender.toUpperCase());
      sql += ` AND (gender = $${params.length} OR gender = 'UNISEX')`;
    }

    sql += ' ORDER BY category ASC, name ASC';
    const result = await db.query(sql, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function getServiceBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const result = await db.query('SELECT * FROM services WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function createService(req, res, next) {
  try {
    const { name, description, category, gender = 'UNISEX', price, duration_min, image_url, is_active = 1 } = req.body;
    let slug = slugify(name);

    // Ensure unique slug
    const existing = await db.query('SELECT id FROM services WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const result = await db.query(
      `INSERT INTO services (name, slug, description, category, gender, price, duration_min, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, slug, description, category.toUpperCase(), gender.toUpperCase(), Number(price), Number(duration_min), image_url, is_active ? 1 : 0]
    );

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, category, gender, price, duration_min, image_url, is_active } = req.body;

    const current = await db.query('SELECT * FROM services WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const s = current.rows[0];
    const updatedName = name !== undefined ? name : s.name;
    const updatedDesc = description !== undefined ? description : s.description;
    const updatedCat = category !== undefined ? category.toUpperCase() : s.category;
    const updatedGender = gender !== undefined ? gender.toUpperCase() : s.gender;
    const updatedPrice = price !== undefined ? Number(price) : s.price;
    const updatedDur = duration_min !== undefined ? Number(duration_min) : s.duration_min;
    const updatedImg = image_url !== undefined ? image_url : s.image_url;
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : s.is_active;

    const result = await db.query(
      `UPDATE services
       SET name = $1, description = $2, category = $3, gender = $4, price = $5, duration_min = $6, image_url = $7, is_active = $8
       WHERE id = $9 RETURNING *`,
      [updatedName, updatedDesc, updatedCat, updatedGender, updatedPrice, updatedDur, updatedImg, updatedActive, id]
    );

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    // Check if appointments reference this service
    const appCheck = await db.query('SELECT COUNT(*) as count FROM appointments WHERE service_id = $1', [id]);
    if (parseInt(appCheck.rows[0].count, 10) > 0) {
      // Soft-deactivate to preserve appointment history
      await db.query('UPDATE services SET is_active = 0 WHERE id = $1', [id]);
      return res.json({
        success: true,
        message: 'Service has existing appointment records. It has been deactivated instead of deleted.'
      });
    }

    await db.query('DELETE FROM services WHERE id = $1', [id]);
    res.json({
      success: true,
      message: 'Service deleted permanently.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
};
