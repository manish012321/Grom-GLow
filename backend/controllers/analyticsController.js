// backend/controllers/analyticsController.js
const { db } = require('../config/db');

async function getDashboardAnalytics(req, res, next) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Today's appointments count
    const todayAppRes = await db.query(
      'SELECT COUNT(*) as count FROM appointments WHERE date = $1',
      [today]
    );
    const todayAppointments = parseInt(todayAppRes.rows[0].count, 10);

    // Today's revenue (from confirmed/completed appointments)
    const todayRevRes = await db.query(
      `SELECT COALESCE(SUM(s.price), 0) as revenue
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.date = $1 AND a.status IN ('CONFIRMED', 'COMPLETED')`,
      [today]
    );
    const todayRevenue = parseFloat(todayRevRes.rows[0].revenue || 0);

    // Total completed appointments
    const completedRes = await db.query(
      "SELECT COUNT(*) as count FROM appointments WHERE status = 'COMPLETED'"
    );
    const totalCompleted = parseInt(completedRes.rows[0].count, 10);

    // Total customers
    const custRes = await db.query('SELECT COUNT(*) as count FROM customers');
    const totalCustomers = parseInt(custRes.rows[0].count, 10);

    // Total overall revenue
    const totalRevRes = await db.query(
      `SELECT COALESCE(SUM(s.price), 0) as revenue
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.status IN ('CONFIRMED', 'COMPLETED')`
    );
    const totalRevenue = parseFloat(totalRevRes.rows[0].revenue || 0);

    // Status breakdown
    const statusRes = await db.query(
      `SELECT status, COUNT(*) as count
       FROM appointments
       GROUP BY status`
    );
    const statusBreakdown = statusRes.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count, 10);
      return acc;
    }, {});

    // Popular services
    const popServicesRes = await db.query(
      `SELECT s.id, s.name, s.category, s.price, COUNT(a.id) as booking_count, SUM(s.price) as total_revenue
       FROM services s
       LEFT JOIN appointments a ON s.id = a.service_id
       GROUP BY s.id, s.name, s.category, s.price
       ORDER BY booking_count DESC, s.name ASC
       LIMIT 5`
    );

    // Popular stylists
    const popStylistsRes = await db.query(
      `SELECT st.id, st.name, st.image_url, COUNT(a.id) as booking_count
       FROM stylists st
       LEFT JOIN appointments a ON st.id = a.stylist_id
       GROUP BY st.id, st.name, st.image_url
       ORDER BY booking_count DESC
       LIMIT 5`
    );

    // Recent 5 appointments for immediate schedule preview
    const recentRes = await db.query(
      `SELECT a.id, a.booking_code, a.date, a.start_time, a.status,
              c.name as customer_name, c.phone as customer_phone,
              s.name as service_name, s.price as service_price,
              st.name as stylist_name
       FROM appointments a
       JOIN customers c ON a.customer_id = c.id
       JOIN services s ON a.service_id = s.id
       JOIN stylists st ON a.stylist_id = st.id
       ORDER BY a.date DESC, a.start_time DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        metrics: {
          todayAppointments,
          todayRevenue,
          totalCompleted,
          totalCustomers,
          totalRevenue,
          statusBreakdown: {
            PENDING: statusBreakdown.PENDING || 0,
            CONFIRMED: statusBreakdown.CONFIRMED || 0,
            COMPLETED: statusBreakdown.COMPLETED || 0,
            CANCELLED: statusBreakdown.CANCELLED || 0,
            NO_SHOW: statusBreakdown.NO_SHOW || 0
          }
        },
        popularServices: popServicesRes.rows,
        popularStylists: popStylistsRes.rows,
        recentAppointments: recentRes.rows
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardAnalytics
};
