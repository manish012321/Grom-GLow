// frontend/components/Footer.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#181715] text-[#FDFBF7] pt-20 pb-28 md:pb-16 border-t border-[#2A2825]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-[#2B2926]">
          {/* Brand Col */}
          <div className="space-y-6">
            <div>
              <span className="font-editorial text-3xl tracking-[0.2em] font-light text-[#FDFBF7] uppercase">
                Groom & Glow
              </span>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C5A880] mt-1 font-sans">
                Beauty, refined.
              </p>
            </div>
            <p className="text-sm text-[#A6A19A] leading-relaxed font-light pr-4">
              An architectural unisex sanctuary where contemporary precision meets time-honored artisanal care. Designed entirely around you.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-[#3A3733] flex items-center justify-center text-[#A6A19A] hover:text-[#C5A880] hover:border-[#C5A880] transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-[#3A3733] flex items-center justify-center text-[#A6A19A] hover:text-[#C5A880] hover:border-[#C5A880] transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              Explore Menu
            </h4>
            <ul className="space-y-3 text-sm text-[#A6A19A] font-light">
              <li>
                <Link href="/services" className="hover:text-[#FDFBF7] transition-colors flex items-center justify-between group">
                  <span>Signature Hair Services</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/services?category=SKIN" className="hover:text-[#FDFBF7] transition-colors flex items-center justify-between group">
                  <span>Clinical Facials & Peels</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/services?category=GROOMING" className="hover:text-[#FDFBF7] transition-colors flex items-center justify-between group">
                  <span>Gentlemen Grooming & Shave</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/gallery#transformations" className="hover:text-[#FDFBF7] transition-colors flex items-center justify-between group">
                  <span>Before & After Showcase</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/memberships" className="hover:text-[#FDFBF7] transition-colors flex items-center justify-between group">
                  <span>Membership Privileges</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Salon Hours */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              Atelier Hours
            </h4>
            <div className="space-y-3 text-sm text-[#A6A19A] font-light">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#FDFBF7] font-normal">Monday – Saturday</div>
                  <div className="text-xs text-[#8C8780]">09:00 AM – 08:00 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#FDFBF7] font-normal">Sunday</div>
                  <div className="text-xs text-[#8C8780]">10:00 AM – 06:00 PM</div>
                </div>
              </div>
              <p className="text-xs text-[#8C8780] pt-2">
                Private styling suites available upon early reservation.
              </p>
            </div>
          </div>

          {/* Atelier Location & Contact */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              Location & Inquiries
            </h4>
            <div className="space-y-3.5 text-sm text-[#A6A19A] font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>42 Heritage Promenade, Linking Road, Bandra West, Mumbai 400050</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="tel:+919820100000" className="hover:text-[#FDFBF7] transition-colors">
                  +91 98201 00000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="mailto:concierge@groomandglow.com" className="hover:text-[#FDFBF7] transition-colors">
                  concierge@groomandglow.com
                </a>
              </div>
              <div className="pt-2">
                <Link
                  href="/book"
                  className="text-xs uppercase tracking-[0.14em] text-[#C5A880] underline underline-offset-4 hover:text-[#FDFBF7] transition-colors"
                >
                  Reserve an Appointment Online →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#736E67]">
          <div>
            © {new Date().getFullYear()} Groom & Glow Atelier Ltd. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/contact" className="hover:text-[#FDFBF7] transition-colors">
              Concierge
            </Link>
            <Link href="/admin/login" className="text-[#C5A880] hover:text-[#FDFBF7] transition-colors font-medium">
              Admin & Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
