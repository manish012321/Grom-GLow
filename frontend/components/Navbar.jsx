// frontend/components/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, Sparkles, UserCheck } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'For Everyone', href: '/services?gender=UNISEX' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Before & After', href: '/gallery#transformations' },
    { name: 'Offers', href: '/offers' },
    { name: 'Our Team', href: '/team' },
    { name: 'Memberships', href: '/memberships' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Contact', href: '/contact' }
  ];

  // If in admin route, the customer navbar shouldn't overlap
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-xs py-3.5' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex flex-col items-start">
            <span className="font-editorial text-2xl md:text-3xl tracking-[0.2em] font-medium text-[#181715] uppercase transition-colors group-hover:text-[#C5A880]">
              Groom & Glow
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C8780] -mt-1 font-sans">
              Beauty, Refined.
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.14em] font-medium transition-colors hover:text-[#C5A880] ${
                    isActive ? 'text-[#C5A880] font-semibold' : 'text-[#4A4744]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/admin/login"
              className="text-[11px] uppercase tracking-[0.15em] text-[#6B6661] hover:text-[#181715] flex items-center gap-1.5 px-3 py-2 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Staff</span>
            </Link>

            <Link
              href="/book"
              className="luxury-button-primary rounded-none"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              href="/book"
              className="text-[11px] uppercase tracking-[0.12em] bg-[#181715] text-[#FDFBF7] px-3.5 py-2 font-medium"
            >
              Book
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#181715] hover:text-[#C5A880] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isOpen && (
          <div className="md:hidden bg-[#FDFBF7] border-b border-[#ECE7DE] px-6 py-6 shadow-xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-[0.16em] text-[#181715] hover:text-[#C5A880] py-1 border-b border-[#F7F4EE]"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href="/book"
                  onClick={() => setIsOpen(false)}
                  className="luxury-button-primary w-full text-center"
                >
                  Book Appointment
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="text-xs uppercase tracking-wider text-center text-[#8C8780] hover:text-[#181715] py-2"
                >
                  Staff Portal Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Sticky CTA on mobile */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <Link
          href="/book"
          className="luxury-button-primary w-full shadow-2xl py-3.5 text-center text-xs tracking-[0.15em]"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment</span>
        </Link>
      </div>
    </>
  );
}
