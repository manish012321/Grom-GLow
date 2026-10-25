// frontend/app/services/page.js
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Clock, Scissors, ArrowRight, Sparkles } from 'lucide-react';

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialGender = searchParams.get('gender') || 'ALL';

  const [category, setCategory] = useState(initialCategory);
  const [gender, setGender] = useState(initialGender);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const res = await api.getServices({ activeOnly: 'true' });
        setServices(res.data || []);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const categories = ['ALL', 'HAIR', 'SKIN', 'NAILS', 'MAKEUP', 'GROOMING', 'SPA'];

  const filteredServices = services.filter((s) => {
    const matchCategory = category === 'ALL' || s.category === category;
    const matchGender = gender === 'ALL' || s.gender === gender || s.gender === 'UNISEX';
    return matchCategory && matchGender;
  });

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
          Comprehensive Atelier Menu
        </span>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-[#181715] mt-2">
          Services & Pricing
        </h1>
        <p className="text-sm text-[#736E67] mt-3 font-light leading-relaxed">
          Crafted with uncompromising attention to detail. All rituals include bespoke consultation and restorative botanical preparations.
        </p>
      </div>

      {/* Gender Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-[#F5F2EB] rounded-xs border border-[#ECE7DE]">
          {['ALL', 'MEN', 'WOMEN', 'UNISEX'].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                gender === g
                  ? 'bg-[#181715] text-[#FDFBF7] shadow-xs'
                  : 'text-[#736E67] hover:text-[#181715]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors border ${
              category === cat
                ? 'border-[#181715] bg-[#181715] text-[#FDFBF7]'
                : 'border-[#ECE7DE] bg-white text-[#736E67] hover:border-[#C5A880]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Listing */}
      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-[#8C8780]">
          Curating Treatments...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className="group bg-white border border-[#ECE7DE] hover:border-[#C5A880] rounded-xs overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
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

                <div className="p-6">
                  <h3 className="font-editorial text-2xl text-[#181715] font-normal leading-snug">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-[#736E67] mt-2 font-light leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#ECE7DE] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#A6A19A]">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{svc.duration_min} mins</span>
                    </div>
                    <div className="font-editorial text-2xl font-semibold text-[#181715] mt-0.5">
                      {formatCurrency(svc.price)}
                    </div>
                  </div>

                  <Link
                    href={`/book?service=${svc.id}`}
                    className="luxury-button-primary text-xs px-5 py-2.5"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Need custom consultation banner */}
      <div className="mt-20 p-10 bg-[#F7F4EE] border border-[#ECE7DE] rounded-xs text-center max-w-3xl mx-auto">
        <Sparkles className="w-6 h-6 text-[#C5A880] mx-auto mb-3" />
        <h3 className="font-editorial text-3xl font-light text-[#181715]">
          Seeking a bespoke bridal or styling transformation?
        </h3>
        <p className="text-xs text-[#736E67] mt-2 max-w-lg mx-auto font-light leading-relaxed">
          Our Creative Directors offer personalized 20-minute consultations before booking elaborate color corrections or bridal suites.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/book" className="luxury-button-primary text-xs">
            Reserve Consultation
          </Link>
          <Link href="/contact" className="luxury-button-secondary text-xs">
            Contact Concierge
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center">Loading...</div>}>
      <ServicesContent />
    </Suspense>
  );
}

