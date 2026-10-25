# GROOM & GLOW — Haute Unisex Salon & Atelier Platform

> **Beauty, refined.**  
> A full-stack luxury salon management platform featuring an editorial client web experience and a high-efficiency SaaS admin dashboard.

---

## 1. Architectural Overview

```text
groom-and-glow/
│
├── frontend/                     # Next.js (App Router, JavaScript Only, Tailwind CSS, Framer Motion, Lucide)
│   ├── app/                      # App router pages (Home, Services, Book, Gallery, Team, Offers, Reviews, Contact, Admin)
│   │   ├── admin/                # SaaS Admin Dashboard & Management views
│   │   │   ├── appointments/     # Table & Day schedule views with action drawer
│   │   │   ├── services/         # Treatment CRUD and active/inactive toggle
│   │   │   ├── stylists/         # Stylist profiles & weekly working hour / break editor
│   │   │   ├── customers/        # Client CRM, lifetime spend & appointment histories
│   │   │   ├── offers/           # Promotional campaign CRUD
│   │   │   ├── memberships/      # Membership tier configuration
│   │   │   ├── gallery/          # Media and before/after transformation management
│   │   │   ├── reviews/          # Review approval and moderation
│   │   │   └── analytics/        # Business volume and status charts
│   ├── components/               # Navbar, Footer, BookingWizard, BeforeAfterSlider, FloatingWhatsApp, Admin widgets
│   ├── lib/                      # Unified API client and formatting utilities
│   └── public/                   # Static assets
│
├── backend/                      # Node.js + Express REST API
│   ├── config/db.js              # Universal database adapter (PostgreSQL / Supabase + zero-config local SQLite)
│   ├── controllers/              # REST controllers for all salon business domains
│   ├── routes/                   # Express route definitions
│   ├── middleware/               # JWT auth, role authorization, validation, centralized error handling
│   ├── services/                 # Slot availability collision engine, email dispatcher, WhatsApp helper
│   ├── db/                       # Relational schema (schema.sql) and full dataset seeder (seed.js)
│   └── server.js                 # Express application server
│
└── README.md
```

---

## 2. Key Features

### Customer Experience
* **Editorial Luxury Aesthetic**: Warm cream/ivory background (`#FDFBF7`), deep charcoal typography, subtle champagne accents (`#C5A880`), and editorial serif headings.
* **Framer Motion Micro-Interactions**: Smooth entrance reveals, staggered list transitions, and interactive controls.
* **Collision-Proof 5-Step Booking Flow**:
  1. *Choose Treatment* (Hair, Skin, Nails, Makeup, Grooming, Spa with Unisex/Men/Women filtering)
  2. *Choose Stylist* (Specific senior artisan or "Any Available Specialist")
  3. *Choose Date & Live Hour* (Auto-computes available slots using stylist schedules, breaks, and existing appointments)
  4. *Guest Details* (Name, phone, email, scalp notes)
  5. *Confirmation Card* (Booking ID `GG-XXXXX`, Add to Google Calendar / iCal button, and direct WhatsApp confirmation chat)
* **Interactive Before & After Slider**: Draggable split-view slider comparing color, cut, and facial transformations.
* **Salon Concierge**: Floating WhatsApp button and Google Maps atelier integration in Bandra West, Mumbai.

### Admin Dashboard (`/admin`)
* **Live KPI Dashboard**: Today's Appointments, Today's Revenue (INR), Active Clientele, and Completed services count.
* **Appointment Schedule Management**: Filter by date, status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`), or stylist. Detailed modal with instant one-click status transitions.
* **Services CRUD**: Add, edit, adjust prices/durations, and deactivate services safely without breaking historical bookings.
* **Stylist Availability Engine**: Configure working hours per day of the week (Monday to Sunday), set break times, and toggle days off.
* **Customer CRM**: Search by name/phone, sort by total spend, view complete booking history.
* **Offers & Memberships**: Create seasonal discount codes and manage Glow Essential, Glow Elevated, and Glow Prestige VIP tiers.
* **Media & Review Moderation**: Curate transformation photos and moderate customer reviews before public display.

---

## 3. Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start the Backend API Server

```bash
cd backend
npm install
npm run seed      # Seeds 16+ services, 5 stylists with working hours, reviews, gallery, sample appointments
npm run dev       # Starts Express API on port 5000
```

### 2. Start the Frontend Next.js App

```bash
cd frontend
npm install
npm run dev       # Starts Next.js dev server on http://localhost:3000
```

Open `http://localhost:3000` in your browser.

---

## 4. Default Admin Credentials

For development and evaluation, the database is pre-seeded with:

- **Staff Portal URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@groomandglow.com`
- **Password**: `admin123`

### Creating Additional Admin Accounts Securely
To create an admin account programmatically with password hashing:

```bash
cd backend
node -e "
const bcrypt = require('bcryptjs');
const { db } = require('./config/db');
(async () => {
  const hash = await bcrypt.hash('YOUR_SECURE_PASSWORD', 10);
  await db.query('INSERT INTO users (email, password_hash, name, role) VALUES (\$1, \$2, \$3, \$4)',
    ['manager@groomandglow.com', hash, 'Salon Manager', 'ADMIN']);
  console.log('Admin account created successfully.');
  process.exit(0);
})();
"
```

---

## 5. Database Configuration

The application uses an intelligent database adapter (`backend/config/db.js`):
- **Default**: Automatic zero-config SQLite stored at `backend/data/groom_and_glow.db`. Runs instantly without needing external database software.
- **PostgreSQL / Supabase**: Simply set `DATABASE_URL` in `backend/.env`:
  ```env
  DATABASE_URL=postgres://user:password@host:port/dbname
  ```
  The adapter automatically connects via PostgreSQL pool using parameterized queries.

---

## 6. License
ISC License © Groom & Glow Atelier Ltd.
