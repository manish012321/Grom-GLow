// backend/controllers/appointmentController.js
const { db } = require('../config/db');
const { isSlotAvailable, timeToMinutes, minutesToTime } = require('../services/availabilityService');
const emailService = require('../services/emailService');
const { getWhatsAppUrl } = require('../services/whatsappService');

function generateBookingCode() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `GG-${num}`;
}

async function createAppointment(req, res, next) {
  try {
    const { serviceId, stylistId, date, startTime, customer, notes } = req.body;

    // Fetch service
    const serviceRes = await db.query('SELECT * FROM services WHERE id = $1 AND is_active = 1', [serviceId]);
    if (serviceRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Selected service is no longer available.' });
    }
    const service = serviceRes.rows[0];

    // Determine target stylist
    let selectedStylistId = stylistId;
    if (!selectedStylistId || selectedStylistId === 'any') {
      // Find an available stylist for this slot
      const allStylists = await db.query('SELECT id FROM stylists WHERE is_active = 1');
      let foundId = null;
      for (const st of allStylists.rows) {
        const check = await isSlotAvailable(st.id, date, startTime, service.duration_min);
        if (check.available) {
          foundId = st.id;
          break;
        }
      }
      if (!foundId) {
        return res.status(400).json({
          success: false,
          message: 'No stylist is available at this selected time. Please select another slot.'
        });
      }
      selectedStylistId = foundId;
    } else {
      // Check availability for specific stylist
      const check = await isSlotAvailable(selectedStylistId, date, startTime, service.duration_min);
      if (!check.available) {
        return res.status(400).json({
          success: false,
          message: check.reason || 'Selected time slot is no longer available.'
        });
      }
    }

    const stylistRes = await db.query('SELECT * FROM stylists WHERE id = $1', [selectedStylistId]);
    const stylist = stylistRes.rows[0];

    // Compute end time
    const startMins = timeToMinutes(startTime);
    const endMins = startMins + service.duration_min;
    const endTime = minutesToTime(endMins);

    // Upsert customer by phone
    let customerId;
    const existingCust = await db.query('SELECT * FROM customers WHERE phone = $1', [customer.phone.trim()]);
    if (existingCust.rows.length > 0) {
      customerId = existingCust.rows[0].id;
      // Update name/email if provided
      await db.query(
        `UPDATE customers
         SET name = $1, email = COALESCE($2, email), total_visits = total_visits + 1, total_spent = total_spent + $3
         WHERE id = $4`,
        [customer.name.trim(), customer.email ? customer.email.trim() : null, service.price, customerId]
      );
    } else {
      const newCust = await db.query(
        `INSERT INTO customers (name, phone, email, notes, total_visits, total_spent)
         VALUES ($1, $2, $3, $4, 1, $5) RETURNING id`,
        [customer.name.trim(), customer.phone.trim(), customer.email ? customer.email.trim() : null, customer.notes || '', service.price]
      );
      customerId = newCust.rows[0].id;
    }

    // Generate unique booking code
    let bookingCode = generateBookingCode();
    let unique = false;
    while (!unique) {
      const codeCheck = await db.query('SELECT id FROM appointments WHERE booking_code = $1', [bookingCode]);
      if (codeCheck.rows.length === 0) {
        unique = true;
      } else {
        bookingCode = generateBookingCode();
      }
    }

    // Insert appointment
    const appRes = await db.query(
      `INSERT INTO appointments (booking_code, customer_id, service_id, stylist_id, date, start_time, end_time, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'CONFIRMED', $8) RETURNING *`,
      [bookingCode, customerId, service.id, selectedStylistId, date, startTime, endTime, notes || '']
    );
    const appointment = appRes.rows[0];

    // Generate WhatsApp link
    const whatsappUrl = getWhatsAppUrl({
      bookingCode,
      serviceName: service.name,
      stylistName: stylist.name,
      date,
      time: startTime,
      customerName: customer.name
    });

    // Send asynchronous email notification
    emailService.sendBookingConfirmed({
      customerEmail: customer.email,
      customerName: customer.name,
      serviceName: service.name,
      stylistName: stylist.name,
      date,
      time: startTime,
      bookingCode
    }).catch(err => console.error('Email error:', err.message));

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: {
        appointment: {
          id: appointment.id,
          bookingCode: appointment.booking_code,
          date: appointment.date,
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          status: appointment.status,
          notes: appointment.notes
        },
        service: {
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration_min
        },
        stylist: {
          id: stylist.id,
          name: stylist.name,
          image: stylist.image_url
        },
        customer: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email
        },
        whatsappUrl
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getAllAppointments(req, res, next) {
  try {
    const { date, status, stylistId, search, startDate, endDate, limit = 100 } = req.query;

    let sql = `
      SELECT 
        a.id, a.booking_code, a.date, a.start_time, a.end_time, a.status, a.notes, a.created_at,
        c.id as customer_id, c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
        s.id as service_id, s.name as service_name, s.price as service_price, s.duration_min as service_duration, s.category as service_category,
        st.id as stylist_id, st.name as stylist_name, st.image_url as stylist_image
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      JOIN services s ON a.service_id = s.id
      JOIN stylists st ON a.stylist_id = st.id
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      params.push(date);
      sql += ` AND a.date = $${params.length}`;
    }

    if (startDate && endDate) {
      params.push(startDate);
      sql += ` AND a.date >= $${params.length}`;
      params.push(endDate);
      sql += ` AND a.date <= $${params.length}`;
    }

    if (status && status !== 'ALL') {
      params.push(status.toUpperCase());
      sql += ` AND a.status = $${params.length}`;
    }

    if (stylistId && stylistId !== 'ALL') {
      params.push(stylistId);
      sql += ` AND a.stylist_id = $${params.length}`;
    }

    if (search) {
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
      const p1 = params.length - 2;
      const p2 = params.length - 1;
      const p3 = params.length;
      sql += ` AND (LOWER(c.name) LIKE $${p1} OR LOWER(c.phone) LIKE $${p2} OR LOWER(a.booking_code) LIKE $${p3})`;
    }

    sql += ' ORDER BY a.date DESC, a.start_time DESC';
    params.push(parseInt(limit, 10));
    sql += ` LIMIT $${params.length}`;

    const result = await db.query(sql, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function getAppointmentById(req, res, next) {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        a.id, a.booking_code, a.date, a.start_time, a.end_time, a.status, a.notes, a.created_at,
        c.id as customer_id, c.name as customer_name, c.phone as customer_phone, c.email as customer_email, c.total_visits, c.total_spent,
        s.id as service_id, s.name as service_name, s.price as service_price, s.duration_min as service_duration, s.category as service_category,
        st.id as stylist_id, st.name as stylist_name, st.image_url as stylist_image, st.phone as stylist_phone
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      JOIN services s ON a.service_id = s.id
      JOIN stylists st ON a.stylist_id = st.id
      WHERE a.id = $1 OR a.booking_code = $1
    `;
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function updateAppointmentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const result = await db.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status.toUpperCase(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.json({
      success: true,
      message: `Appointment status updated to ${status.toUpperCase()}`,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

async function cancelAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query(
      "UPDATE appointments SET status = 'CANCELLED' WHERE id = $1 OR booking_code = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully.',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
};
