// frontend/app/admin/memberships/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit2, Trash2, Crown, Check, X } from 'lucide-react';

export default function AdminMembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 1999,
    duration_months: 3,
    benefits: '',
    discount_percent: 10,
    is_active: 1
  });

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const res = await api.getMemberships();
      setMemberships(res.data || []);
    } catch (err) {
      console.error('Failed to load memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      price: 1999,
      duration_months: 3,
      benefits: '10% off all salon services\nPriority booking access\nFree beverage pass',
      discount_percent: 10,
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration_months: plan.duration_months,
      benefits: plan.benefits || '',
      discount_percent: plan.discount_percent,
      is_active: plan.is_active ? 1 : 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.updateMembership(editingPlan.id, formData);
      } else {
        await api.createMembership(formData);
      }
      setIsModalOpen(false);
      await fetchMemberships();
    } catch (err) {
      alert(err.message || 'Failed to save membership plan');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this membership plan?')) return;
    try {
      await api.deleteMembership(id);
      await fetchMemberships();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-light text-[#181715]">
            Membership Tiers
          </h2>
          <p className="text-xs text-[#736E67] font-light">
            Define VIP subscription plans, privileges, durations, and fee perks.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="luxury-button-primary text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memberships.map((plan) => (
          <div
            key={plan.id}
            className="bg-white border border-[#ECE7DE] rounded-xs p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C8780] font-semibold block">
                    {plan.duration_months} Months Duration
                  </span>
                  <h3 className="font-editorial text-2xl text-[#181715] font-normal mt-0.5">
                    {plan.name}
                  </h3>
                </div>
                <Crown className="w-5 h-5 text-[#C5A880]" />
              </div>

              <div className="font-editorial text-3xl font-semibold text-[#181715] mb-4">
                {formatCurrency(plan.price)}
              </div>

              <div className="p-2.5 bg-[#FDFBF7] border border-[#ECE7DE] rounded-xs text-xs font-semibold text-[#C5A880] uppercase tracking-wider text-center mb-5">
                {plan.discount_percent}% Off All Salon Rituals
              </div>

              <div className="space-y-2 text-xs">
                {plan.benefits?.split('\n').map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-[#4A4744]">
                    <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                    <span>{b.replace(/^[-•*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-[#ECE7DE] flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                plan.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500'
              }`}>
                {plan.is_active ? 'Active' : 'Inactive'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(plan)}
                  className="p-1.5 text-[#736E67] hover:text-[#181715] hover:bg-[#F5F2EB] rounded-xs"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
              Membership Architecture
            </span>
            <h3 className="font-editorial text-2xl font-light text-[#181715] mt-1 mb-6">
              {editingPlan ? 'Edit Membership Plan' : 'Create Membership Plan'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. GLOW ELEVATED"
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Duration (Months) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.duration_months}
                    onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Salon Discount (%)
                </label>
                <input
                  type="number"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Privileges & Benefits (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] resize-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="luxury-button-primary w-full text-xs py-3"
                >
                  {editingPlan ? 'Update Plan' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
