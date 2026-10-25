// frontend/lib/api.js
const API_BASE = '/api';

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gg_auth_token');
  }
  return null;
}

export function setAuthToken(token) {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('gg_auth_token', token);
    } else {
      localStorage.removeItem('gg_auth_token');
    }
  }
}

export function getStoredUser() {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('gg_auth_user');
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}

export function setStoredUser(user) {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('gg_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gg_auth_user');
    }
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Services
  getServices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/services${query ? `?${query}` : ''}`);
  },
  getServiceBySlug: (slug) => request(`/services/${slug}`),
  createService: (data) => request('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => request(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  // Stylists
  getStylists: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/stylists${query ? `?${query}` : ''}`);
  },
  getStylistById: (id) => request(`/stylists/${id}`),
  getStylistSlots: (id, date, duration = 45) => request(`/stylists/${id}/slots?date=${date}&duration=${duration}`),
  createStylist: (data) => request('/stylists', { method: 'POST', body: JSON.stringify(data) }),
  updateStylist: (id, data) => request(`/stylists/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateStylistSchedule: (id, schedules) => request(`/stylists/${id}/schedule`, { method: 'PATCH', body: JSON.stringify({ schedules }) }),
  deleteStylist: (id) => request(`/stylists/${id}`, { method: 'DELETE' }),

  // Appointments
  createAppointment: (data) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  getAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/appointments${query ? `?${query}` : ''}`);
  },
  getAppointmentById: (id) => request(`/appointments/${id}`),
  updateAppointmentStatus: (id, status) => request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  cancelAppointment: (id) => request(`/appointments/${id}/cancel`, { method: 'POST' }),

  // Customers
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/customers${query ? `?${query}` : ''}`);
  },
  getCustomerById: (id) => request(`/customers/${id}`),

  // Offers
  getOffers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/offers${query ? `?${query}` : ''}`);
  },
  createOffer: (data) => request('/offers', { method: 'POST', body: JSON.stringify(data) }),
  updateOffer: (id, data) => request(`/offers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteOffer: (id) => request(`/offers/${id}`, { method: 'DELETE' }),

  // Memberships
  getMemberships: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/memberships${query ? `?${query}` : ''}`);
  },
  createMembership: (data) => request('/memberships', { method: 'POST', body: JSON.stringify(data) }),
  updateMembership: (id, data) => request(`/memberships/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteMembership: (id) => request(`/memberships/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/gallery${query ? `?${query}` : ''}`);
  },
  getGalleryAdmin: () => request('/gallery/admin'),
  createGalleryItem: (data) => request('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  deleteGalleryItem: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews: () => request('/reviews'),
  getReviewsAdmin: () => request('/reviews/admin'),
  submitReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  updateReviewStatus: (id, status) => request(`/reviews/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteReview: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: () => request('/analytics')
};
