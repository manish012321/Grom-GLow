-- Groom & Glow Database Schema

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'ADMIN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  total_visits INTEGER DEFAULT 0,
  total_spent REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- HAIR, SKIN, NAILS, MAKEUP, GROOMING, SPA
  gender TEXT NOT NULL DEFAULT 'UNISEX', -- MEN, WOMEN, UNISEX
  price REAL NOT NULL,
  duration_min INTEGER NOT NULL,
  image_url TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stylists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  bio TEXT,
  experience_years INTEGER DEFAULT 5,
  specialties TEXT, -- Comma-separated or JSON list
  image_url TEXT,
  phone TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stylist_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stylist_id INTEGER NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time TEXT NOT NULL DEFAULT '09:00',
  end_time TEXT NOT NULL DEFAULT '20:00',
  break_start TEXT DEFAULT '13:00',
  break_end TEXT DEFAULT '14:00',
  is_day_off INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_code TEXT UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  stylist_id INTEGER NOT NULL REFERENCES stylists(id),
  date TEXT NOT NULL, -- YYYY-MM-DD
  start_time TEXT NOT NULL, -- HH:MM
  end_time TEXT NOT NULL, -- HH:MM
  status TEXT DEFAULT 'PENDING', -- PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  discount_percent INTEGER NOT NULL,
  promo_code TEXT,
  start_date TEXT,
  end_date TEXT,
  applicable_services TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  duration_months INTEGER NOT NULL,
  benefits TEXT, -- newline or bullet-separated
  discount_percent INTEGER DEFAULT 15,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Hair, Makeup, Men, Women, Transformations, Salon
  image_url TEXT NOT NULL,
  is_before_after INTEGER DEFAULT 0,
  before_image_url TEXT,
  after_image_url TEXT,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL, -- 1 to 5
  comment TEXT NOT NULL,
  service_name TEXT,
  status TEXT DEFAULT 'APPROVED', -- PENDING, APPROVED, HIDDEN, REJECTED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_stylist_date ON appointments(stylist_id, date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_gender ON services(gender);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
