// frontend/app/memberships/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Check, Crown, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMemberships() {
      try {
        setLoading(true);
        const res = await api.getMemberships({ activeOnly: 'true' });
        setMemberships(res.data || []);
      } catch (err) {
        console.error('Membership load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMemberships();
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
          Annual Patronage
        </span>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-[#181715] mt-2">
          Glow Memberships
        </h1>
        <p className="text-sm text-[#736E67] mt-3 font-light leading-relaxed">
          Elevate your self-care into a continuous ritual. Enjoy year-round fee privileges, private suite reservations, and complimentary companion therapies.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-[#8C8780]">
          Loading Membership Tiers...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {memberships.map((m, idx) => {
            const isFeatured = idx === 1; // Middle tier (Elevated)
            return (
              <div
                key={m.id}
                className={`relative rounded-xs p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-[#181715] text-[#FDFBF7] shadow-2xl border-2 border-[#C5A880] scale-102'
                    : 'bg-white text-[#181715] border border-[#ECE7DE] hover:border-[#C5A880] shadow-xs'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C5A880] text-[#181715] text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1 rounded-full shadow-md">
                    Most Favored
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${isFeatured ? 'text-[#C5A880]' : 'text-[#A6A19A]'}`}>
                        {m.duration_months} Months Access
                      </span>
                      <h3 className="font-editorial text-3xl font-light mt-1">
                        {m.name}
                      </h3>
                    </div>
                    {isFeatured && <Crown className="w-6 h-6 text-[#C5A880]" />}
                  </div>

                  <div className="mb-6">
                    <div className="font-editorial text-4xl font-semibold">
                      {formatCurrency(m.price)}
                    </div>
                    <span className={`text-xs ${isFeatured ? 'text-[#A6A19A]' : 'text-[#8C8780]'}`}>
                      billed once for {m.duration_months} months
                    </span>
                  </div>

                  <div className={`p-3 rounded-xs text-xs font-semibold uppercase tracking-wider mb-8 text-center ${
                    isFeatured ? 'bg-[#2A2825] text-[#C5A880]' : 'bg-[#F5F2EB] text-[#181715]'
                  }`}>
                    {m.discount_percent}% Off All Salon Rituals
                  </div>

                  <div className="space-y-3">
                    <span className={`text-[10px] uppercase tracking-widest font-semibold block mb-2 ${isFeatured ? 'text-[#C5A880]' : 'text-[#A6A19A]'}`}>
                      Included Privileges
                    </span>
                    {m.benefits?.split('\n').map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3 text-xs leading-relaxed">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isFeatured ? 'text-[#C5A880]' : 'text-[#A38350]'}`} />
                        <span className={isFeatured ? 'text-[#ECE7DE]' : 'text-[#4A4744]'}>
                          {benefit.replace(/^[-•*]\s*/, '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-[#ECE7DE]/30">
                  <Link
                    href={`/contact?membership=${encodeURIComponent(m.name)}`}
                    className={`w-full text-xs text-center ${
                      isFeatured ? 'luxury-button-primary bg-[#C5A880] border-[#C5A880] text-[#181715] hover:bg-white hover:border-white' : 'luxury-button-secondary'
                    }`}
                  >
                    <span>Enroll via Concierge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
