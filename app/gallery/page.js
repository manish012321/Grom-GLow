// frontend/app/gallery/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const res = await api.getGallery();
        setGalleryItems(res.data || []);
      } catch (err) {
        console.error('Gallery loading error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const categories = ['ALL', 'Transformations', 'Hair', 'Makeup', 'Men', 'Women', 'Salon'];

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const beforeAfterItems = galleryItems.filter(item => item.is_before_after);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
          Visual Anthology
        </span>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-[#181715] mt-2">
          Gallery & Transformations
        </h1>
        <p className="text-sm text-[#736E67] mt-3 font-light leading-relaxed">
          An intimate look at our atelier floor, precision hair architecture, luminous skin restorations, and before-and-after client journeys.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-14 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors border ${
              activeCategory === cat
                ? 'border-[#181715] bg-[#181715] text-[#FDFBF7]'
                : 'border-[#ECE7DE] bg-white text-[#736E67] hover:border-[#C5A880]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SECTION: Before & After Sliders */}
      {(activeCategory === 'ALL' || activeCategory === 'Transformations') && (
        <section id="transformations" className="mb-20">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <h2 className="font-editorial text-3xl font-light text-[#181715]">
              Interactive Transformations
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {beforeAfterItems.map((item) => (
              <BeforeAfterSlider
                key={item.id}
                title={item.title}
                description={item.description}
                beforeImage={item.before_image_url}
                afterImage={item.after_image_url}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION: Editorial Photos Grid */}
      <div>
        <div className="flex items-center gap-2 mb-8">
          <ImageIcon className="w-4 h-4 text-[#C5A880]" />
          <h2 className="font-editorial text-3xl font-light text-[#181715]">
            Atelier Photography
          </h2>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#8C8780]">
            Curating Portfolio...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems
              .filter(item => !item.is_before_after || activeCategory === 'Transformations')
              .map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white border border-[#ECE7DE] rounded-xs overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#ECE7DE]">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#181715]/80 text-[#FDFBF7] text-[9px] uppercase tracking-widest px-2.5 py-1 font-semibold backdrop-blur-xs">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-editorial text-xl text-[#181715] font-normal">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-[#736E67] mt-1 font-light leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-4 pt-3 border-t border-[#ECE7DE] flex items-center justify-between">
                      <Link
                        href="/book"
                        className="text-xs uppercase tracking-wider font-semibold text-[#181715] hover:text-[#C5A880] flex items-center gap-1"
                      >
                        <span>Book Similar Look</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
