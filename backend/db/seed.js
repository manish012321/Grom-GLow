const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');

async function seedDatabase() {
  console.log('Initializing database schema...');
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

  // Split schema statements and execute
  const statements = schemaSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    await db.query(statement);
  }
  console.log('Schema initialized successfully.');

  // Check if admin exists
  const existingUsers = await db.query('SELECT * FROM users WHERE email = $1', ['admin@groomandglow.com']);
  if (existingUsers.rows.length === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)`,
      ['admin@groomandglow.com', passwordHash, 'Salon Director', 'ADMIN']
    );
    console.log('Default admin created: admin@groomandglow.com / admin123');
  }

  // Check services
  const existingServices = await db.query('SELECT COUNT(*) as count FROM services');
  const serviceCount = parseInt(existingServices.rows[0].count, 10);

  if (serviceCount === 0) {
    console.log('Seeding services...');
    const services = [
      // HAIR
      {
        name: 'Signature Haircut & Editorial Styling',
        slug: 'signature-haircut-styling',
        description: 'Bespoke precision haircut, balancing consultation, relaxing wash, and runway-ready styling.',
        category: 'HAIR',
        gender: 'UNISEX',
        price: 899,
        duration_min: 45,
        image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Signature Balayage & French Gloss',
        slug: 'balayage-french-gloss',
        description: 'Hand-painted sun-kissed dimension followed by an ultra-conditioning luminous French gloss seal.',
        category: 'HAIR',
        gender: 'WOMEN',
        price: 3499,
        duration_min: 120,
        image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Keratin Silk Smoothing Therapy',
        slug: 'keratin-silk-smoothing',
        description: 'Formaldehyde-free organic smoothing treatment for frizz-free, luminous, velvety strands for up to 5 months.',
        category: 'HAIR',
        gender: 'UNISEX',
        price: 4499,
        duration_min: 150,
        image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Japanese Head Spa & Scalp Detox',
        slug: 'japanese-head-spa',
        description: 'Holistic waterfall scalp circulation therapy, micro-exfoliation, acupressure neck massage, and deep repair.',
        category: 'HAIR',
        gender: 'UNISEX',
        price: 1999,
        duration_min: 60,
        image_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Gentlemen Precision Fade & Textured Cut',
        slug: 'gentlemen-fade-textured-cut',
        description: 'Taper fade or scissor texture tailored to facial structure, finished with cooling scalp tonic.',
        category: 'HAIR',
        gender: 'MEN',
        price: 649,
        duration_min: 40,
        image_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80'
      },
      // SKIN
      {
        name: '24K Gold Radiance Facial',
        slug: '24k-gold-radiance-facial',
        description: 'Opulent cellular rejuvenation with real gold peptides, lymphatic drainage massage, and illuminator mask.',
        category: 'SKIN',
        gender: 'UNISEX',
        price: 2799,
        duration_min: 75,
        image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'HydraGlow Diamond Peel Therapy',
        slug: 'hydraglow-diamond-peel',
        description: 'Vortex deep pore extraction, lactic infusion, diamond microdermabrasion, and hyper-antioxidant boost.',
        category: 'SKIN',
        gender: 'UNISEX',
        price: 3199,
        duration_min: 60,
        image_url: 'https://images.unsplash.com/photo-1512290900672-1f41d99ce65c?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Active Charcoal Oxygen Cleanse',
        slug: 'active-charcoal-oxygen-cleanse',
        description: 'Purifying skin treatment to dissolve deep sebum, soothe irritation, and restore natural matte glow.',
        category: 'SKIN',
        gender: 'MEN',
        price: 1499,
        duration_min: 45,
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
      },
      // NAILS
      {
        name: 'Velvet Gel Manicure & Hand Ritual',
        slug: 'velvet-gel-manicure',
        description: 'Cuticle restoration, organic honey-almond scrub, heated mitt infusion, and non-chip designer gel polish.',
        category: 'NAILS',
        gender: 'UNISEX',
        price: 1199,
        duration_min: 50,
        image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Eucalyptus Deluxe Spa Pedicure',
        slug: 'deluxe-spa-pedicure',
        description: 'Dead sea salt soak, volcanic pumice exfoliation, botanical paraffin wrap, and deep foot reflex massage.',
        category: 'NAILS',
        gender: 'UNISEX',
        price: 1499,
        duration_min: 60,
        image_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80'
      },
      // MAKEUP
      {
        name: 'Red Carpet Evening Glam',
        slug: 'red-carpet-evening-glam',
        description: 'Sculpted dewy complexion, custom false lashes, smokey cut-crease or minimalist glass skin with setting veil.',
        category: 'MAKEUP',
        gender: 'WOMEN',
        price: 3499,
        duration_min: 75,
        image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Royal Haute Couture Bridal Artistry',
        slug: 'royal-couture-bridal',
        description: 'Masterclass bridal experience including HD airbrush, jewelry setting, dupatta draping, and touch-up kit.',
        category: 'MAKEUP',
        gender: 'WOMEN',
        price: 8999,
        duration_min: 150,
        image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
      },
      // GROOMING
      {
        name: 'Royal Beard Sculpt & Hot Towel Lineup',
        slug: 'royal-beard-sculpt',
        description: 'Sandalwood steam prep, straight razor perimeter sharpening, hot eucalyptus towels, and conditioning beard elixir.',
        category: 'GROOMING',
        gender: 'MEN',
        price: 499,
        duration_min: 30,
        image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Traditional Ottoman Hot Lather Shave',
        slug: 'traditional-hot-lather-shave',
        description: 'Multi-step pre-shave oil massage, double badger lather, Japanese feather blade shave, and cold marble finish.',
        category: 'GROOMING',
        gender: 'MEN',
        price: 599,
        duration_min: 35,
        image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80'
      },
      // SPA
      {
        name: 'Aromatherapy Tension Release Massage',
        slug: 'aromatherapy-tension-release',
        description: 'Warm cedarwood and bergamot essential oils melted into shoulder, upper back, and neck tension nodes.',
        category: 'SPA',
        gender: 'UNISEX',
        price: 2499,
        duration_min: 60,
        image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Botanical Cane Sugar & Honey Body Polish',
        slug: 'botanical-cane-sugar-polish',
        description: 'Full body silk smoothing scrub infused with wild honey, shea butter, and restorative floral waters.',
        category: 'SPA',
        gender: 'UNISEX',
        price: 3299,
        duration_min: 75,
        image_url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80'
      }
    ];

    for (const s of services) {
      await db.query(
        `INSERT INTO services (name, slug, description, category, gender, price, duration_min, image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1)`,
        [s.name, s.slug, s.description, s.category, s.gender, s.price, s.duration_min, s.image_url]
      );
    }
  }

  // Check Stylists
  const existingStylists = await db.query('SELECT COUNT(*) as count FROM stylists');
  if (parseInt(existingStylists.rows[0].count, 10) === 0) {
    console.log('Seeding stylists & schedules...');
    const stylists = [
      {
        name: 'Meera Kapoor',
        bio: 'Senior Hair Artisan & Balayage Specialist trained in Paris and Mumbai with an editorial eye for dimension and effortless movement.',
        experience_years: 8,
        specialties: 'Balayage, Hair Coloring, Precision Bobs, French Styling',
        image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
        phone: '+91 98201 11223'
      },
      {
        name: 'Vikram Rao',
        bio: 'Master Barber and Grooming Director specializing in architectural fades, royal beard sculpting, and restorative scalp therapy.',
        experience_years: 10,
        specialties: 'Beard Sculpting, Taper Fades, Scalp Therapy, Traditional Shaves',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        phone: '+91 98201 22334'
      },
      {
        name: 'Aisha Patel',
        bio: 'Certified Clinical Aesthetician dedicated to transformative cellular facials, microdermabrasion, and radiant luminous skin.',
        experience_years: 7,
        specialties: '24K Gold Facial, HydraGlow Peels, Lymphatic Drainage, Cleanse',
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        phone: '+91 98201 33445'
      },
      {
        name: 'Rohit Verma',
        bio: 'Celebrity Makeup Maestro and Creative Director with over a decade curating runway, high-fashion editorials, and regal bridal looks.',
        experience_years: 11,
        specialties: 'Bridal Artistry, Airbrush Makeup, Red Carpet Glam, Contour',
        image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        phone: '+91 98201 44556'
      },
      {
        name: 'Zara Sen',
        bio: 'Master Nail Stylist & Spa Wellness Practitioner known for intricate nail architecture, luxury paraffin rituals, and stress therapy.',
        experience_years: 6,
        specialties: 'Gel Nails, Nail Artistry, Aromatherapy Massage, Reflexology',
        image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        phone: '+91 98201 55667'
      }
    ];

    for (let i = 0; i < stylists.length; i++) {
      const st = stylists[i];
      const res = await db.query(
        `INSERT INTO stylists (name, bio, experience_years, specialties, image_url, phone, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, 1) RETURNING id`,
        [st.name, st.bio, st.experience_years, st.specialties, st.image_url, st.phone]
      );
      const stylistId = res.rows[0].id;

      // Seed working schedule for 7 days (0: Sun to 6: Sat)
      for (let day = 0; day <= 6; day++) {
        // give each stylist a staggered day off for realism
        const isDayOff = (i === 0 && day === 1) || // Meera off Monday
                         (i === 1 && day === 2) || // Vikram off Tuesday
                         (i === 2 && day === 3) || // Aisha off Wednesday
                         (i === 3 && day === 4) || // Rohit off Thursday
                         (i === 4 && day === 0);   // Zara off Sunday

        const startTime = day === 0 ? '10:00' : '09:00';
        const endTime = day === 0 ? '18:00' : '20:00';
        const breakStart = '13:00';
        const breakEnd = '14:00';

        await db.query(
          `INSERT INTO stylist_schedules (stylist_id, day_of_week, start_time, end_time, break_start, break_end, is_day_off)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [stylistId, day, startTime, endTime, breakStart, breakEnd, isDayOff ? 1 : 0]
        );
      }
    }
  }

  // Seed Customers
  const existingCustomers = await db.query('SELECT COUNT(*) as count FROM customers');
  if (parseInt(existingCustomers.rows[0].count, 10) === 0) {
    console.log('Seeding customers...');
    const customers = [
      { name: 'Ananya Sharma', phone: '+91 98201 99881', email: 'ananya.s@example.com', notes: 'Prefers organic non-scented hair toner. Regular client.', total_visits: 8, total_spent: 14650 },
      { name: 'Kabir Mehta', phone: '+91 98201 99882', email: 'kabir.m@example.com', notes: 'Executive client. Likes quick 30-min sharp beard trims.', total_visits: 5, total_spent: 4250 },
      { name: 'Priya Nair', phone: '+91 98201 99883', email: 'priya.n@example.com', notes: 'Sensory sensitive skin. Hydrafacial regular.', total_visits: 6, total_spent: 19100 },
      { name: 'Rohan Bose', phone: '+91 98201 99884', email: 'rohan.b@example.com', notes: 'Likes iced green tea during styling session.', total_visits: 3, total_spent: 2850 },
      { name: 'Sonia Gupta', phone: '+91 98201 99885', email: 'sonia.g@example.com', notes: 'VIP Member. Booked for pre-wedding glam trial.', total_visits: 11, total_spent: 29800 }
    ];

    for (const c of customers) {
      await db.query(
        `INSERT INTO customers (name, phone, email, notes, total_visits, total_spent)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [c.name, c.phone, c.email, c.notes, c.total_visits, c.total_spent]
      );
    }
  }

  // Seed Sample Appointments
  const existingAppointments = await db.query('SELECT COUNT(*) as count FROM appointments');
  if (parseInt(existingAppointments.rows[0].count, 10) === 0) {
    console.log('Seeding sample appointments...');
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const sampleAppointments = [
      {
        booking_code: 'GG-10291',
        customer_id: 1,
        service_id: 2, // Balayage
        stylist_id: 1, // Meera
        date: today,
        start_time: '11:00',
        end_time: '13:00',
        status: 'CONFIRMED',
        notes: 'Requested champagne blonde gloss toner.'
      },
      {
        booking_code: 'GG-10292',
        customer_id: 2,
        service_id: 13, // Beard sculpt
        stylist_id: 2, // Vikram
        date: today,
        start_time: '14:30',
        end_time: '15:00',
        status: 'CONFIRMED',
        notes: 'Lineup and eucalyptus hot towel.'
      },
      {
        booking_code: 'GG-10293',
        customer_id: 3,
        service_id: 7, // HydraGlow
        stylist_id: 3, // Aisha
        date: today,
        start_time: '16:00',
        end_time: '17:00',
        status: 'PENDING',
        notes: 'First time trying the diamond peel package.'
      },
      {
        booking_code: 'GG-10294',
        customer_id: 4,
        service_id: 5, // Fade
        stylist_id: 2, // Vikram
        date: today,
        start_time: '10:00',
        end_time: '10:40',
        status: 'COMPLETED',
        notes: 'Completed morning session.'
      },
      {
        booking_code: 'GG-10295',
        customer_id: 5,
        service_id: 11, // Red carpet glam
        stylist_id: 4, // Rohit
        date: tomorrow,
        start_time: '15:00',
        end_time: '16:15',
        status: 'CONFIRMED',
        notes: 'Attending evening awards gala.'
      }
    ];

    for (const app of sampleAppointments) {
      await db.query(
        `INSERT INTO appointments (booking_code, customer_id, service_id, stylist_id, date, start_time, end_time, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [app.booking_code, app.customer_id, app.service_id, app.stylist_id, app.date, app.start_time, app.end_time, app.status, app.notes]
      );
    }
  }

  // Seed Offers
  const existingOffers = await db.query('SELECT COUNT(*) as count FROM offers');
  if (parseInt(existingOffers.rows[0].count, 10) === 0) {
    console.log('Seeding offers...');
    const offers = [
      {
        title: 'WEEKEND RADIANCE RITUAL',
        description: 'Complimentary scalp massage and French gloss seal when you book any Gold Facial or Signature Balayage.',
        discount_percent: 20,
        promo_code: 'WEEKENDGLOW',
        start_date: '2026-09-01',
        end_date: '2026-10-31',
        applicable_services: 'Hair, Skin'
      },
      {
        title: 'FIRST-TIME VIP PRIVILEGE',
        description: 'Experience Groom & Glow excellence with 15% off your entire first salon booking.',
        discount_percent: 15,
        promo_code: 'WELCOMEGLOW',
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        applicable_services: 'All Services'
      },
      {
        title: 'ROYAL BRIDAL & GROOM SUITE',
        description: 'Complete celebration pampering: Hair architecture, dewy makeup, and royal beard sculpt for the couple.',
        discount_percent: 25,
        promo_code: 'ROYALPAIR',
        start_date: '2026-08-01',
        end_date: '2026-11-30',
        applicable_services: 'Bridal, Grooming, Spa'
      },
      {
        title: 'MIDWEEK DETOX & RESET',
        description: 'Indulge in a 60-min Japanese Head Spa and receive 20% off an accompanying Deep Pore Facial.',
        discount_percent: 20,
        promo_code: 'RESET20',
        start_date: '2026-09-10',
        end_date: '2026-10-15',
        applicable_services: 'Spa, Skin'
      }
    ];

    for (const off of offers) {
      await db.query(
        `INSERT INTO offers (title, description, discount_percent, promo_code, start_date, end_date, applicable_services, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 1)`,
        [off.title, off.description, off.discount_percent, off.promo_code, off.start_date, off.end_date, off.applicable_services]
      );
    }
  }

  // Seed Memberships
  const existingMemberships = await db.query('SELECT COUNT(*) as count FROM memberships');
  if (parseInt(existingMemberships.rows[0].count, 10) === 0) {
    console.log('Seeding memberships...');
    const memberships = [
      {
        name: 'GLOW ESSENTIAL',
        price: 1999,
        duration_months: 3,
        benefits: '10% off all haircuts and beard styling\nFree monthly scalp detox treatment\nPriority weekend booking slot reservations\n1 complimentary guest beverage pass',
        discount_percent: 10
      },
      {
        name: 'GLOW ELEVATED',
        price: 3999,
        duration_months: 6,
        benefits: '15% off all salon services & spa treatments\n2 complimentary 24K Gold Face Masks\nUnlimited hot towel treatments\nStylist direct booking access\nExclusive product sample boxes',
        discount_percent: 15
      },
      {
        name: 'GLOW PRESTIGE',
        price: 6999,
        duration_months: 12,
        benefits: '20% off all services year-round\nFree bridal/gala consultation & trial session\nDedicated VIP private grooming suite\nComplimentary companion service on your birthday\nPersonalized concierge booking',
        discount_percent: 20
      }
    ];

    for (const m of memberships) {
      await db.query(
        `INSERT INTO memberships (name, price, duration_months, benefits, discount_percent, is_active)
         VALUES ($1, $2, $3, $4, $5, 1)`,
        [m.name, m.price, m.duration_months, m.benefits, m.discount_percent]
      );
    }
  }

  // Seed Gallery & Before / After
  const existingGallery = await db.query('SELECT COUNT(*) as count FROM gallery');
  if (parseInt(existingGallery.rows[0].count, 10) === 0) {
    console.log('Seeding gallery and before/after pairs...');
    const galleryItems = [
      {
        title: 'Dimensional Honey Balayage',
        category: 'Transformations',
        image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        is_before_after: 1,
        before_image_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
        after_image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        description: 'Transition from dull, brassy lengths to sunlit French balayage with high-shine toner.'
      },
      {
        title: 'Precision Beard Architecture',
        category: 'Transformations',
        image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        is_before_after: 1,
        before_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        after_image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        description: 'Overgrown texture reshaped with a razor-sharp fade and deep beard balm moisture ritual.'
      },
      {
        title: 'HydraGlow Diamond Rejuvenation',
        category: 'Transformations',
        image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        is_before_after: 1,
        before_image_url: 'https://images.unsplash.com/photo-1512290900672-1f41d99ce65c?auto=format&fit=crop&w=800&q=80',
        after_image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        description: 'Restoration of dehydrated dull skin into dewy, plumping radiance in a single 60-minute session.'
      },
      {
        title: 'The Modern Salon Lounge',
        category: 'Salon',
        image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
        is_before_after: 0,
        description: 'Our tranquil waiting lounge featuring warm champagne lighting, travertine marble, and espresso bar.'
      },
      {
        title: 'Private Styling Suites',
        category: 'Salon',
        image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        is_before_after: 0,
        description: 'Acoustically secluded personal styling stations with ergonomic Italian leather chairs.'
      },
      {
        title: 'Silk Press & Glass Hair Finish',
        category: 'Hair',
        image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        is_before_after: 0,
        description: 'Mirror-reflecting smooth finish crafted using organic botanical heat shields.'
      },
      {
        title: 'Editorial Haute Couture Makeup',
        category: 'Makeup',
        image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
        is_before_after: 0,
        description: 'Understated glamour with luminous skin and feathered brow styling by Rohit Verma.'
      },
      {
        title: 'Sculpted Razor Fade',
        category: 'Men',
        image_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
        is_before_after: 0,
        description: 'Crisp low-skin taper fade styled with matte sea-salt clay.'
      },
      {
        title: 'Minimalist Chrome Gel Nails',
        category: 'Women',
        image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
        is_before_after: 0,
        description: 'Pearl glazed almond nails with delicate 24k gold line detailing.'
      },
      {
        title: 'Aroma Scalp Therapy Basin',
        category: 'Salon',
        image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
        is_before_after: 0,
        description: 'Ergonomic Japanese wash basins equipped with ambient water halos and chromotherapy.'
      }
    ];

    for (const g of galleryItems) {
      await db.query(
        `INSERT INTO gallery (title, category, image_url, is_before_after, before_image_url, after_image_url, description, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 1)`,
        [g.title, g.category, g.image_url, g.is_before_after, g.before_image_url || null, g.after_image_url || null, g.description]
      );
    }
  }

  // Seed Reviews
  const existingReviews = await db.query('SELECT COUNT(*) as count FROM reviews');
  if (parseInt(existingReviews.rows[0].count, 10) === 0) {
    console.log('Seeding authentic customer reviews...');
    const reviews = [
      {
        customer_name: 'Ananya Sharma',
        rating: 5,
        comment: 'Groom & Glow redefined what salon luxury feels like. Meera worked absolute magic on my balayage — the tone is sun-kissed perfection, and my hair feels healthier than before. The ambience is serene and impeccably clean.',
        service_name: 'Signature Balayage & French Gloss',
        status: 'APPROVED'
      },
      {
        customer_name: 'Kabir Mehta',
        rating: 5,
        comment: 'Hands down the best men’s grooming in town. Vikram takes his time with the beard fade and hot towel lineup. No rush, just pure craftsmanship. Booking online took literally 30 seconds.',
        service_name: 'Royal Beard Sculpt & Hot Towel Lineup',
        status: 'APPROVED'
      },
      {
        customer_name: 'Priya Nair',
        rating: 5,
        comment: 'The HydraGlow facial gave me compliments all week at work. Aisha analyzed my skin texture thoroughly before selecting the serums. I left feeling completely revitalized.',
        service_name: 'HydraGlow Diamond Peel Therapy',
        status: 'APPROVED'
      },
      {
        customer_name: 'Rohan Bose',
        rating: 5,
        comment: 'First time visiting after a recommendation from a colleague. The Japanese head spa is an absolute must-try. The scalp massage relieved weeks of computer screen tension.',
        service_name: 'Japanese Head Spa & Scalp Detox',
        status: 'APPROVED'
      },
      {
        customer_name: 'Tara Mukherjee',
        rating: 5,
        comment: 'Booked Rohit for an evening cocktail reception. He gave me a flawless dewy look that lasted 8 hours without a single crease. Everyone kept asking where I got it done!',
        service_name: 'Red Carpet Evening Glam',
        status: 'APPROVED'
      },
      {
        customer_name: 'Devraj Sen',
        rating: 4,
        comment: 'Excellent haircut and very polite staff. The complimentary espresso was a classy touch. The salon interior feels like a 5-star hotel.',
        service_name: 'Signature Haircut & Editorial Styling',
        status: 'APPROVED'
      },
      {
        customer_name: 'Sonia Gupta',
        rating: 5,
        comment: 'Joined the Glow Prestige membership and it pays for itself easily. The VIP suite is peaceful and the private treatment is unmatched. Groom & Glow is in a league of its own.',
        service_name: 'Royal Haute Couture Bridal Artistry',
        status: 'APPROVED'
      },
      {
        customer_name: 'Kavita Rao',
        rating: 5,
        comment: 'Zara’s nail art is poetry on fingertips! The gel manicure lasted four weeks without chipping. Love the minimalist aesthetic of the salon.',
        service_name: 'Velvet Gel Manicure & Hand Ritual',
        status: 'APPROVED'
      }
    ];

    for (const r of reviews) {
      await db.query(
        `INSERT INTO reviews (customer_name, rating, comment, service_name, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [r.customer_name, r.rating, r.comment, r.service_name, r.status]
      );
    }
  }

  console.log('Seeding completed successfully!');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
