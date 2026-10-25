// frontend/app/book/page.js
'use client';

import { Suspense } from 'react';
import BookingWizard from '@/components/BookingWizard';
import { Sparkles, Loader2 } from 'lucide-react';

export default function BookPage() {
  return (
    <div className="pt-32 pb-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2EAE0] text-[#A38350] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
            Concierge Online Reservations
          </span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-light text-[#181715]">
          Book Your Appointment
        </h1>
        <p className="text-xs sm:text-sm text-[#736E67] mt-2 font-light">
          Reserve in under 60 seconds. Real-time availability with collision-proof slot confirmation.
        </p>
      </div>

      <Suspense fallback={
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C5A880]" />
          <p className="mt-4 text-xs uppercase tracking-widest text-[#8C8780]">Loading Booking Engine...</p>
        </div>
      }>
        <BookingWizard />
      </Suspense>
    </div>
  );
}
