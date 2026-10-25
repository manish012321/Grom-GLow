// backend/services/whatsappService.js
/**
 * WhatsApp integration utility
 * Formats message and returns direct click-to-chat URL
 */
const DEFAULT_SALON_PHONE = process.env.WHATSAPP_NUMBER || '919820100000';

function formatBookingMessage({ bookingCode, serviceName, stylistName, date, time, customerName }) {
  return [
    `*Groom & Glow Appointment*`,
    `--------------------------`,
    `Hello! I would like to inquire/confirm regarding my appointment:`,
    `*Booking ID:* ${bookingCode}`,
    `*Client:* ${customerName}`,
    `*Service:* ${serviceName}`,
    `*Stylist:* ${stylistName}`,
    `*Date:* ${date}`,
    `*Time:* ${time}`,
    `--------------------------`,
    `Thank you!`
  ].join('\n');
}

function getWhatsAppUrl({ bookingCode, serviceName, stylistName, date, time, customerName }) {
  const text = formatBookingMessage({ bookingCode, serviceName, stylistName, date, time, customerName });
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${DEFAULT_SALON_PHONE}?text=${encoded}`;
}

module.exports = {
  formatBookingMessage,
  getWhatsAppUrl,
  DEFAULT_SALON_PHONE
};
