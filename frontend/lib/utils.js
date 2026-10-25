// frontend/lib/utils.js

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function createGoogleCalendarUrl({ title, description, location, date, startTime, endTime }) {
  const startIso = `${date.replace(/-/g, '')}T${startTime.replace(':', '')}00`;
  const endIso = `${date.replace(/-/g, '')}T${endTime.replace(':', '')}00`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    location: location || 'Groom & Glow Unisex Salon, 42 Heritage Promenade, Bandra West, Mumbai',
    dates: `${startIso}/${endIso}`
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
