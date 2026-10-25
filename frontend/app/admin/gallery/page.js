// frontend/app/admin/gallery/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hair',
    image_url: '',
    is_before_after: 0,
    before_image_url: '',
    after_image_url: '',
    description: ''
  });

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.getGalleryAdmin();
      setItems(res.data || []);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createGalleryItem(formData);
      setIsModalOpen(false);
      setFormData({
        title: '',
        category: 'Hair',
        image_url: '',
        is_before_after: 0,
        before_image_url: '',
        after_image_url: '',
        description: ''
      });
      await fetchGallery();
    } catch (err) {
      alert(err.message || 'Failed to add gallery item');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await api.deleteGalleryItem(id);
      await fetchGallery();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-light text-[#181715]">
            Gallery & Transformations
          </h2>
          <p className="text-xs text-[#736E67] font-light">
            Upload salon photography, categorize looks, and curate before & after comparisons.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="luxury-button-primary text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#ECE7DE] rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-[#ECE7DE] overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#181715]/80 text-[#FDFBF7] text-[9px] uppercase tracking-widest px-2 py-0.5 font-semibold">
                  {item.category} {item.is_before_after ? '• Before/After' : ''}
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-editorial text-lg text-[#181715] font-normal">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-[#736E67] mt-1 line-clamp-2 font-light">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-[#ECE7DE] flex items-center justify-end">
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-xs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD ITEM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#ECE7DE] rounded-xs max-w-md w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#8C8780] hover:text-[#181715]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
              Media Uploader
            </span>
            <h3 className="font-editorial text-2xl font-light text-[#181715] mt-1 mb-6">
              Add Photo or Transformation
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Modern Balayage Dimension"
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] bg-white"
                >
                  <option value="Hair">Hair</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Transformations">Transformations</option>
                  <option value="Salon">Salon</option>
                </select>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="ba_toggle"
                  checked={formData.is_before_after === 1}
                  onChange={(e) => setFormData({
                    ...formData,
                    is_before_after: e.target.checked ? 1 : 0,
                    category: e.target.checked ? 'Transformations' : formData.category
                  })}
                  className="rounded border-[#ECE7DE]"
                />
                <label htmlFor="ba_toggle" className="text-xs font-semibold text-[#181715] cursor-pointer">
                  This is an interactive Before & After transformation
                </label>
              </div>

              {formData.is_before_after === 1 ? (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                      Before Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.before_image_url}
                      onChange={(e) => setFormData({ ...formData, before_image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                      After Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.after_image_url}
                      onChange={(e) => setFormData({ ...formData, after_image_url: e.target.value, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Styling details..."
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] resize-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="luxury-button-primary w-full text-xs py-3"
                >
                  Save Gallery Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
