// backend/services/emailService.js
/**
 * Modular email service for Groom & Glow
 * Ready for integration with SendGrid, Resend, or SMTP
 */
const emailService = {
  async sendBookingReceived({ customerEmail, customerName, serviceName, stylistName, date, time, bookingCode }) {
    console.log(`[EMAIL DISPATCH: BOOKING RECEIVED] To: ${customerEmail || customerName}`);
    console.log(`Dear ${customerName}, your appointment request [${bookingCode}] for ${serviceName} with ${stylistName} on ${date} at ${time} has been received.`);
    return { success: true, mocked: true };
  },

  async sendBookingConfirmed({ customerEmail, customerName, serviceName, stylistName, date, time, bookingCode }) {
    console.log(`[EMAIL DISPATCH: BOOKING CONFIRMED] To: ${customerEmail || customerName}`);
    console.log(`Dear ${customerName}, your Groom & Glow appointment [${bookingCode}] is confirmed! We look forward to pampering you on ${date} at ${time}.`);
    return { success: true, mocked: true };
  },

  async sendBookingCancelled({ customerEmail, customerName, serviceName, date, time, bookingCode }) {
    console.log(`[EMAIL DISPATCH: BOOKING CANCELLED] To: ${customerEmail || customerName}`);
    console.log(`Dear ${customerName}, your appointment [${bookingCode}] on ${date} at ${time} has been cancelled.`);
    return { success: true, mocked: true };
  }
};

module.exports = emailService;
