// backend/controllers/galleryController.js
const { db } = require('../config/db');

async function getGalleryItems(req, res, next) {
  try {
    const { category, beforeAfterOnly } = req.query;
    let sql = 'SELECT * FROM gallery WHERE is_active = 1';
    const params = [];

    if (category && category !== 'ALL') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (beforeAfterOnly === 'true') {
      sql += ' AND is_before_after = 1';
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

async function getAllGalleryAdmin(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM gallery ORDER BY id DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function createGalleryItem(req, res, next) {
  try {
    const { title, category, image_url, is_before_after = 0, before_image_url, after_image_url, description } = req.body;
    if (!title || !category || (!image_url && !after_image_url)) {
      return res.status(400).json({ success: false, message: 'Title, category, and image URL are required.' });
    }

    const mainImg = image_url || after_image_url;

    const result = await db.query(
      `INSERT INTO gallery (title, category, image_url, is_before_after, before_image_url, after_image_url, description, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 1) RETURNING *`,
      [title, category, mainImg, is_before_after ? 1 : 0, before_image_url || null, after_image_url || null, description || '']
    );

    res.status(201).json({
      success: true,
      message: 'Gallery item added successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function deleteGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM gallery WHERE id = $1', [id]);
    res.json({
      success: true,
      message: 'Gallery item deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getGalleryItems,
  getAllGalleryAdmin,
  createGalleryItem,
  deleteGalleryItem
};
