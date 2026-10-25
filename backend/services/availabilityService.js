// backend/services/availabilityService.js
const { db } = require('../config/db');

// Helper: parse "HH:MM" into total minutes from midnight
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Helper: convert total minutes from midnight to "HH:MM"
function minutesToTime(totalMins) {
  const h = Math.floor(totalMins / 60).toString().padStart(2, '0');
  const m = (totalMins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

// Helper: check if two time ranges overlap: [startA, endA) and [startB, endB)
function rangesOverlap(startA, endA, startB, endB) {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

/**
 * Calculate available slots for a stylist or any stylist on a given date.
 * @param {number|string} stylistId - ID of stylist, or 'any'
 * @param {string} date - 'YYYY-MM-DD'
 * @param {number} durationMin - duration in minutes
 */
async function getAvailableSlots(stylistId, date, durationMin = 45) {
  const d = new Date(date + 'T00:00:00Z');
  const dayOfWeek = d.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  let targetStylists = [];
  if (stylistId && stylistId !== 'any') {
    const res = await db.query('SELECT * FROM stylists WHERE id = $1 AND is_active = 1', [stylistId]);
    if (res.rows.length === 0) return [];
    targetStylists = res.rows;
  } else {
    const res = await db.query('SELECT * FROM stylists WHERE is_active = 1');
    targetStylists = res.rows;
  }

  const slotMap = new Map(); // timeString -> Array of available stylist IDs

  for (const stylist of targetStylists) {
    // Get schedule for this day of week
    const schedRes = await db.query(
      'SELECT * FROM stylist_schedules WHERE stylist_id = $1 AND day_of_week = $2',
      [stylist.id, dayOfWeek]
    );

    if (schedRes.rows.length === 0) continue;
    const schedule = schedRes.rows[0];
    if (schedule.is_day_off) continue;

    const dayStart = timeToMinutes(schedule.start_time);
    const dayEnd = timeToMinutes(schedule.end_time);
    const breakStart = schedule.break_start ? timeToMinutes(schedule.break_start) : null;
    const breakEnd = schedule.break_end ? timeToMinutes(schedule.break_end) : null;

    // Get existing appointments
    const appRes = await db.query(
      `SELECT start_time, end_time FROM appointments
       WHERE stylist_id = $1 AND date = $2 AND status NOT IN ('CANCELLED', 'NO_SHOW')`,
      [stylist.id, date]
    );

    const appointments = appRes.rows.map(a => ({
      start: timeToMinutes(a.start_time),
      end: timeToMinutes(a.end_time)
    }));

    // Step by 30-minute intervals
    for (let current = dayStart; current + durationMin <= dayEnd; current += 30) {
      const slotStart = current;
      const slotEnd = current + durationMin;

      // Check break collision
      if (breakStart !== null && breakEnd !== null) {
        if (rangesOverlap(slotStart, slotEnd, breakStart, breakEnd)) {
          continue;
        }
      }

      // Check appointment collisions
      let hasConflict = false;
      for (const app of appointments) {
        if (rangesOverlap(slotStart, slotEnd, app.start, app.end)) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        const timeStr = minutesToTime(slotStart);
        if (!slotMap.has(timeStr)) {
          slotMap.set(timeStr, []);
        }
        slotMap.get(timeStr).push({
          stylistId: stylist.id,
          stylistName: stylist.name
        });
      }
    }
  }

  // Format response sorted by time
  const sortedTimes = Array.from(slotMap.keys()).sort();
  return sortedTimes.map(time => ({
    time,
    availableStylists: slotMap.get(time)
  }));
}

/**
 * Verify if a slot is available before confirming a booking
 */
async function isSlotAvailable(stylistId, date, startTime, durationMin) {
  const startMins = timeToMinutes(startTime);
  const endMins = startMins + durationMin;
  const d = new Date(date + 'T00:00:00Z');
  const dayOfWeek = d.getUTCDay();

  // Check schedule
  const schedRes = await db.query(
    'SELECT * FROM stylist_schedules WHERE stylist_id = $1 AND day_of_week = $2',
    [stylistId, dayOfWeek]
  );
  if (schedRes.rows.length === 0 || schedRes.rows[0].is_day_off) {
    return { available: false, reason: 'Stylist is not scheduled to work on this day.' };
  }

  const sched = schedRes.rows[0];
  const dayStart = timeToMinutes(sched.start_time);
  const dayEnd = timeToMinutes(sched.end_time);

  if (startMins < dayStart || endMins > dayEnd) {
    return { available: false, reason: `Requested time is outside working hours (${sched.start_time} - ${sched.end_time}).` };
  }

  if (sched.break_start && sched.break_end) {
    const bStart = timeToMinutes(sched.break_start);
    const bEnd = timeToMinutes(sched.break_end);
    if (rangesOverlap(startMins, endMins, bStart, bEnd)) {
      return { available: false, reason: 'Selected time conflicts with the stylist break time.' };
    }
  }

  // Check collision with appointments
  const appRes = await db.query(
    `SELECT start_time, end_time FROM appointments
     WHERE stylist_id = $1 AND date = $2 AND status NOT IN ('CANCELLED', 'NO_SHOW')`,
    [stylistId, date]
  );

  for (const app of appRes.rows) {
    const aStart = timeToMinutes(app.start_time);
    const aEnd = timeToMinutes(app.end_time);
    if (rangesOverlap(startMins, endMins, aStart, aEnd)) {
      return { available: false, reason: 'This time slot was just booked by another client. Please choose another slot.' };
    }
  }

  return { available: true };
}

module.exports = {
  getAvailableSlots,
  isSlotAvailable,
  timeToMinutes,
  minutesToTime
};
