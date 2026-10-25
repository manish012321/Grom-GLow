// frontend/app/team/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Calendar, ArrowRight, Award, Sparkles } from 'lucide-react';

export default function TeamPage() {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStylists() {
      try {
        setLoading(true);
        const res = await api.getStylists({ activeOnly: 'true' });
        setStylists(res.data || []);
      } catch (err) {
        console.error('Stylist load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStylists();
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
          The Artisans
        </span>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-[#181715] mt-2">
          Meet Our Master Stylists
        </h1>
        <p className="text-sm text-[#736E67] mt-3 font-light leading-relaxed">
          Crafting bespoke silhouettes, radiant color dimension, and restorative skincare therapies tailored specifically to your facial geometry.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs uppercase tracking-widest text-[#8C8780]">
          Gathering Specialists...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stylists.map((st) => (
            <div
              key={st.id}
              className="group bg-white border border-[#ECE7DE] hover:border-[#C5A880] rounded-xs overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE7DE]">
                  <img
                    src={st.image_url}
                    alt={st.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181715]/75 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-[#FDFBF7]">
                    <div className="flex items-center gap-1.5 text-[#C5A880] text-[10px] uppercase tracking-widest font-semibold mb-0.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>{st.experience_years} Years Master Experience</span>
                    </div>
                    <h3 className="font-editorial text-2xl font-normal">
                      {st.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#A6A19A] font-semibold">
                      Specialties
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {st.specialties?.split(',').map((spec, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] uppercase tracking-wider bg-[#F5F2EB] text-[#4A4744] px-2.5 py-1 rounded-xs font-medium"
                        >
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#736E67] font-light leading-relaxed">
                    {st.bio}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#ECE7DE]">
                  <Link
                    href={`/book?stylist=${st.id}`}
                    className="luxury-button-primary w-full text-xs text-center"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book with {st.name.split(' ')[0]}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
