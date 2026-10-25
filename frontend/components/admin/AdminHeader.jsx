// frontend/components/admin/AdminHeader.jsx
'use client';

import { Menu, Bell, User, ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminHeader({ onMenuClick, title = 'Salon Management' }) {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-[#ECE7DE] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-[#736E67] hover:text-[#181715] lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-semibold text-[#181715]">
            {title}
          </h1>
          <div className="text-[11px] text-[#8C8780] hidden sm:flex items-center gap-1.5 font-light">
            <Calendar className="w-3 h-3 text-[#C5A880]" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#736E67] hover:text-[#181715] px-2.5 py-1.5 rounded-xs border border-[#ECE7DE] hover:border-[#181715] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Site</span>
        </Link>

        {/* User profile info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#ECE7DE]">
          <div className="w-8 h-8 rounded-full bg-[#181715] text-[#C5A880] flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-[#181715] leading-tight">
              Salon Director
            </span>
            <span className="block text-[10px] text-[#8C8780]">
              admin@groomandglow.com
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
