// frontend/app/offers/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Tag, Sparkles, ArrowRight, Check, Copy } from 'lucide-react';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    async function loadOffers() {
      try {
        setLoading(true);
        const res = await api.getOffers({ activeOnly: 'true' });
        setOffers(res.data || []);
      } catch (err) {
        console.error('Offers load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
          Curated Privileges
        </span>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-[#181715] mt-2">
          Special Offers & Packages
        </h1>
        <p className="text-sm text-[#736E67] mt-3 font-light leading-relaxed">
          Exclusive seasonal rituals and combination packages curated to elevate your salon journey.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-[#8C8780]">
          Loading Offers...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group relative bg-white border border-[#ECE7DE] hover:border-[#C5A880] rounded-xs p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="champagne-badge">
                    {offer.discount_percent}% Discount
                  </span>
                  {offer.end_date && (
                    <span className="text-[11px] text-[#A6A19A] font-light">
                      Valid through {formatDate(offer.end_date)}
                    </span>
                  )}
                </div>

                <h3 className="font-editorial text-3xl text-[#181715] font-normal leading-tight">
                  {offer.title}
                </h3>

                <p className="text-sm text-[#736E67] mt-3 font-light leading-relaxed">
                  {offer.description}
                </p>

                {offer.applicable_services && (
                  <div className="mt-4 pt-4 border-t border-[#ECE7DE] text-xs text-[#8C8780]">
                    <span className="font-semibold text-[#181715]">Applicable Categories: </span>
                    <span>{offer.applicable_services}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-[#ECE7DE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {offer.promo_code ? (
                  <button
                    onClick={() => handleCopyCode(offer.promo_code)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F5F2EB] border border-[#ECE7DE] text-[#181715] text-xs font-mono font-bold tracking-widest rounded-xs hover:border-[#181715] transition-colors"
                  >
                    <span>{offer.promo_code}</span>
                    {copiedCode === offer.promo_code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#8C8780]" />
                    )}
                  </button>
                ) : (
                  <span className="text-xs text-[#8C8780] italic">
                    Applied automatically at checkout
                  </span>
                )}

                <Link
                  href="/book"
                  className="luxury-button-primary text-xs text-center px-6 py-2.5"
                >
                  <span>Claim Offer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
