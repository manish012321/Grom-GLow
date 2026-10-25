// frontend/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Calendar,
  Sparkles,
  Scissors,
  Award,
  Star,
  ArrowRight,
  ShieldCheck,
  Clock,
  ChevronRight,
  Heart
} from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredStylists, setFeaturedStylists] = useState([]);
  const [activeOffer, setActiveOffer] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [servicesRes, stylistsRes, offersRes, reviewsRes] = await Promise.all([
          api.getServices({ activeOnly: 'true' }),
          api.getStylists({ activeOnly: 'true' }),
          api.getOffers({ activeOnly: 'true' }),
          api.getReviews()
        ]);

        setFeaturedServices((servicesRes.data || []).slice(0, 6));
        setFeaturedStylists((stylistsRes.data || []).slice(0, 4));
        if (offersRes.data && offersRes.data.length > 0) {
          setActiveOffer(offersRes.data[0]);
        }
        setReviews((reviewsRes.data?.reviews || []).slice(0, 3));
      } catch (err) {
        console.error('Home data load error:', err);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-6 lg:px-12 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#F2EAE0] border border-[#E5DACD] text-[#A38350]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                Haute Unisex Salon & Atelier
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-light text-[#181715] leading-[1.05] tracking-tight">
                GROOM & GLOW
              </h1>
              <p className="font-editorial text-3xl sm:text-4xl text-[#C5A880] italic font-normal tracking-wide">
                Beauty, refined.
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#6B6661] max-w-xl font-light leading-relaxed">
              Modern grooming and beauty designed around you. An architectural sanctuary blending precision hairdressing, transformative clinical skin therapies, and artisanal men’s grooming.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/book"
                className="luxury-button-primary text-center px-8 py-4 text-xs tracking-[0.18em]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>

              <Link
                href="/services"
                className="luxury-button-secondary text-center px-8 py-4 text-xs tracking-[0.18em]"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Micro proof badges */}
            <div className="pt-8 border-t border-[#ECE7DE] grid grid-cols-3 gap-6">
              <div>
                <span className="font-editorial text-2xl font-normal text-[#181715]">4.9 ★</span>
                <p className="text-[11px] uppercase tracking-wider text-[#8C8780] mt-0.5">
                  Over 1,200+ Reviews
                </p>
              </div>
              <div>
                <span className="font-editorial text-2xl font-normal text-[#181715]">100%</span>
                <p className="text-[11px] uppercase tracking-wider text-[#8C8780] mt-0.5">
                  Certified Organic
                </p>
              </div>
              <div>
                <span className="font-editorial text-2xl font-normal text-[#181715]">Bespoke</span>
                <p className="text-[11px] uppercase tracking-wider text-[#8C8780] mt-0.5">
                  Private Styling Suites
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-xs overflow-hidden shadow-2xl border border-[#ECE7DE] bg-[#ECE7DE]">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85"
                alt="Groom and Glow Salon Sanctuary"
                className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181715]/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating aesthetic badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#FDFBF7]/95 backdrop-blur-md border border-[#ECE7DE] rounded-xs shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold">
                      Atelier Experience
                    </span>
                    <h3 className="font-editorial text-lg text-[#181715] font-normal">
                      Bespoke Hair Architecture & Aesthetics
                    </h3>
                  </div>
                  <Link
                    href="/book"
                    className="w-8 h-8 rounded-full bg-[#181715] text-[#FDFBF7] flex items-center justify-center hover:bg-[#C5A880] hover:text-[#181715] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION STRIP */}
      <section className="py-12 bg-[#F7F4EE] border-y border-[#ECE7DE]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EAE5DC] flex items-center justify-center shrink-0 text-[#181715]">
                <Scissors className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h4 className="font-editorial text-lg text-[#181715]">Unisex Precision</h4>
                <p className="text-xs text-[#736E67] mt-1 font-light leading-relaxed">
                  Tailored styling, bobs, balayage, and scissor fades crafted for every individual.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EAE5DC] flex items-center justify-center shrink-0 text-[#181715]">
                <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h4 className="font-editorial text-lg text-[#181715]">Organic & Clean</h4>
                <p className="text-xs text-[#736E67] mt-1 font-light leading-relaxed">
                  Formaldehyde-free and botanical extracts imported from France and Japan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EAE5DC] flex items-center justify-center shrink-0 text-[#181715]">
                <Award className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h4 className="font-editorial text-lg text-[#181715]">Master Artisans</h4>
                <p className="text-xs text-[#736E67] mt-1 font-light leading-relaxed">
                  Award-winning stylists with over 40+ collective years in editorial and bridal fashion.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EAE5DC] flex items-center justify-center shrink-0 text-[#181715]">
                <Clock className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h4 className="font-editorial text-lg text-[#181715]">Instant Online Booking</h4>
                <p className="text-xs text-[#736E67] mt-1 font-light leading-relaxed">
                  Real-time slot engine with instant WhatsApp confirmation and zero wait times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE SERVICES PREVIEW */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              The Menu
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181715] mt-2">
              Signature Treatments
            </h2>
            <p className="text-sm text-[#736E67] mt-2 max-w-lg font-light">
              Meticulously designed services spanning hair, clinical skincare, nails, royal grooming, and tranquility spas.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#181715] hover:text-[#C5A880] transition-colors pb-1 border-b border-[#181715] hover:border-[#C5A880]"
          >
            <span>View Full Service Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((svc) => (
            <div
              key={svc.id}
              className="group bg-white border border-[#ECE7DE] hover:border-[#C5A880] rounded-xs overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#ECE7DE]">
                <img
                  src={svc.image_url}
                  alt={svc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#181715]/85 text-[#FDFBF7] text-[9px] uppercase tracking-widest px-2.5 py-1 font-semibold backdrop-blur-xs">
                  {svc.category} • {svc.gender}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-editorial text-2xl text-[#181715] font-normal leading-snug">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-[#736E67] mt-2 font-light leading-relaxed line-clamp-2">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-[#ECE7DE] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A6A19A]">
                      {svc.duration_min} mins
                    </span>
                    <div className="font-editorial text-xl font-semibold text-[#181715]">
                      {formatCurrency(svc.price)}
                    </div>
                  </div>

                  <Link
                    href={`/book?service=${svc.id}`}
                    className="text-xs uppercase tracking-wider font-semibold text-[#181715] hover:text-[#C5A880] flex items-center gap-1 group/btn"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEFORE & AFTER TRANSFORMATION SHOWCASE */}
      <section className="py-24 bg-[#F7F4EE] border-y border-[#ECE7DE] px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              Visible Artistry
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181715] mt-2">
              Before & After Transformations
            </h2>
            <p className="text-sm text-[#736E67] mt-3 font-light">
              Drag the interactive slider below to witness the seamless shift in color, texture, and architectural contouring.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Interactive Slider 1: Hair */}
            <BeforeAfterSlider
              title="Signature French Balayage & Silk Gloss"
              description="Correction of brassy, dull highlights to radiant sunlit blonde dimension with botanical sealing."
              beforeImage="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80"
              afterImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
            />

            {/* Interactive Slider 2: Beard & Grooming */}
            <BeforeAfterSlider
              title="Gentlemen Beard Sculpt & Razor Lineup"
              description="Restoration of unruly beard growth into crisp jawline geometry and hot eucalyptus hydration."
              beforeImage="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
              afterImage="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
            />
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/gallery#transformations"
              className="luxury-button-secondary text-xs tracking-wider"
            >
              <span>Explore All Transformations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. MEET OUR MASTER ARTISANS */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              The Craftsmen
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181715] mt-2">
              Our Master Stylists
            </h2>
            <p className="text-sm text-[#736E67] mt-2 max-w-lg font-light">
              Trained in the fashion capitals of Paris, London, and Mumbai, each artisan brings dedicated specialization.
            </p>
          </div>

          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#181715] hover:text-[#C5A880] transition-colors pb-1 border-b border-[#181715] hover:border-[#C5A880]"
          >
            <span>Meet All Specialists</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredStylists.map((st) => (
            <div
              key={st.id}
              className="group bg-white border border-[#ECE7DE] hover:border-[#C5A880] rounded-xs overflow-hidden transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE7DE]">
                <img
                  src={st.image_url}
                  alt={st.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181715]/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-[#FDFBF7]">
                  <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-semibold">
                    {st.experience_years} Years Experience
                  </span>
                  <h3 className="font-editorial text-2xl font-normal mt-0.5">
                    {st.name}
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs text-[#736E67] line-clamp-2 font-light leading-relaxed">
                  {st.bio}
                </p>
                <div className="mt-4 pt-4 border-t border-[#ECE7DE] flex items-center justify-between">
                  <span className="text-[10px] text-[#A6A19A] uppercase tracking-wider">
                    {st.specialties?.split(',')[0]}
                  </span>
                  <Link
                    href={`/book?stylist=${st.id}`}
                    className="text-xs uppercase tracking-wider font-semibold text-[#181715] hover:text-[#C5A880]"
                  >
                    Reserve →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LIMITED-TIME OFFER BANNER */}
      {activeOffer && (
        <section className="py-16 bg-[#181715] text-[#FDFBF7] px-6 lg:px-12 border-y border-[#2A2825]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="champagne-badge bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30">
                Exclusive Promotion • {activeOffer.discount_percent}% OFF
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-light">
                {activeOffer.title}
              </h3>
              <p className="text-xs text-[#A6A19A] max-w-lg font-light leading-relaxed">
                {activeOffer.description}
              </p>
              {activeOffer.promo_code && (
                <div className="text-xs text-[#C5A880] tracking-widest uppercase font-mono pt-1">
                  Use Code: <span className="font-bold underline">{activeOffer.promo_code}</span>
                </div>
              )}
            </div>

            <Link
              href="/book"
              className="luxury-button-primary bg-[#C5A880] border-[#C5A880] text-[#181715] hover:bg-white hover:border-white hover:text-[#181715] shrink-0 text-xs px-8 py-4"
            >
              <span>Claim Offer Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 7. AUTHENTIC CUSTOMER REVIEWS */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex justify-center items-center gap-1 text-[#C5A880] mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
            Word of Excellence
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181715] mt-2">
            Client Impressions
          </h2>
          <p className="text-sm text-[#736E67] mt-3 font-light">
            Read candid thoughts from our discerning community of patrons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 bg-white border border-[#ECE7DE] rounded-xs shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#C5A880] mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#4A4744] font-light italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#ECE7DE]">
                <div className="font-editorial text-lg text-[#181715] font-normal">
                  {rev.customer_name}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#A6A19A] mt-0.5">
                  {rev.service_name}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/reviews"
            className="text-xs uppercase tracking-wider text-[#C5A880] underline underline-offset-4 hover:text-[#181715] transition-colors"
          >
            Read All Reviews & Share Your Experience →
          </Link>
        </div>
      </section>

      {/* 8. FINAL INVITATION / BOOKING CTA */}
      <section className="py-24 bg-[#F2EAE0] border-t border-[#ECE7DE] px-6 lg:px-12 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
            Reservation
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181715]">
            Ready to experience refined beauty?
          </h2>
          <p className="text-sm text-[#736E67] font-light leading-relaxed">
            Reserve your bespoke styling or clinical skincare ritual now. Guaranteed private attention with zero waiting queues.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="luxury-button-primary w-full sm:w-auto px-10 py-4 text-xs tracking-[0.2em]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Online</span>
            </Link>

            <Link
              href="/contact"
              className="luxury-button-secondary w-full sm:w-auto px-8 py-4 text-xs tracking-[0.2em]"
            >
              <span>Salon Concierge</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
