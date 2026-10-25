// frontend/app/admin/offers/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Plus, Edit2, Trash2, Tag, X, Loader2 } from 'lucide-react';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percent: 20,
    promo_code: '',
    start_date: '',
    end_date: '',
    applicable_services: '',
    is_active: 1
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.getOffers();
      setOffers(res.data || []);
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      discount_percent: 20,
      promo_code: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      applicable_services: 'All Services',
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (off) => {
    setEditingOffer(off);
    setFormData({
      title: off.title,
      description: off.description || '',
      discount_percent: off.discount_percent,
      promo_code: off.promo_code || '',
      start_date: off.start_date || '',
      end_date: off.end_date || '',
      applicable_services: off.applicable_services || '',
      is_active: off.is_active ? 1 : 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await api.updateOffer(editingOffer.id, formData);
      } else {
        await api.createOffer(formData);
      }
      setIsModalOpen(false);
      await fetchOffers();
    } catch (err) {
      alert(err.message || 'Failed to save offer');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promotional offer?')) return;
    try {
      await api.deleteOffer(id);
      await fetchOffers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-light text-[#181715]">
            Promotional Offers
          </h2>
          <p className="text-xs text-[#736E67] font-light">
            Manage seasonal package deals, promo codes, and discount campaigns.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="luxury-button-primary text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((off) => (
          <div
            key={off.id}
            className="bg-white border border-[#ECE7DE] rounded-xs p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="champagne-badge font-mono">
                  {off.discount_percent}% OFF
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  off.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500'
                }`}>
                  {off.is_active ? 'Active on Website' : 'Inactive'}
                </span>
              </div>

              <h3 className="font-editorial text-2xl text-[#181715] font-normal leading-snug">
                {off.title}
              </h3>
              <p className="text-xs text-[#736E67] mt-2 font-light">
                {off.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#ECE7DE] text-xs space-y-1">
                {off.promo_code && (
                  <div>
                    <span className="text-[#8C8780]">Promo Code: </span>
                    <strong className="font-mono text-[#181715]">{off.promo_code}</strong>
                  </div>
                )}
                {off.applicable_services && (
                  <div>
                    <span className="text-[#8C8780]">Categories: </span>
                    <span className="text-[#181715]">{off.applicable_services}</span>
                  </div>
                )}
                {off.end_date && (
                  <div>
                    <span className="text-[#8C8780]">Valid Until: </span>
                    <span className="text-[#181715]">{formatDate(off.end_date)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#ECE7DE] flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(off)}
                className="p-1.5 text-[#736E67] hover:text-[#181715] hover:bg-[#F5F2EB] rounded-xs"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(off.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-xs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
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
              Campaign Manager
            </span>
            <h3 className="font-editorial text-2xl font-light text-[#181715] mt-1 mb-6">
              {editingOffer ? 'Edit Offer' : 'Create Offer'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. WEEKEND GLOW"
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Discount (%) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    value={formData.promo_code}
                    onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
                    placeholder="GLOW20"
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Applicable Services
                </label>
                <input
                  type="text"
                  value={formData.applicable_services}
                  onChange={(e) => setFormData({ ...formData, applicable_services: e.target.value })}
                  placeholder="Facial + Manicure, Hair, Spa"
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active_check"
                  checked={formData.is_active === 1 || formData.is_active === true}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  className="rounded border-[#ECE7DE]"
                />
                <label htmlFor="active_check" className="text-xs font-semibold text-[#181715] cursor-pointer">
                  Display actively on customer website
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="luxury-button-primary w-full text-xs py-3"
                >
                  {editingOffer ? 'Update Offer' : 'Publish Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
