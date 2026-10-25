// frontend/app/admin/services/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit2, Trash2, Scissors, Power, X, Check, Loader2 } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'HAIR',
    gender: 'UNISEX',
    price: '',
    duration_min: 45,
    image_url: '',
    is_active: 1
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.getServices();
      setServices(res.data || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: 'HAIR',
      gender: 'UNISEX',
      price: '',
      duration_min: 45,
      image_url: '',
      is_active: 1
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setFormData({
      name: svc.name,
      description: svc.description || '',
      category: svc.category,
      gender: svc.gender,
      price: svc.price,
      duration_min: svc.duration_min,
      image_url: svc.image_url || '',
      is_active: svc.is_active ? 1 : 0
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.price) {
      setFormError('Name and price are required.');
      return;
    }

    try {
      setSaving(true);
      if (editingService) {
        await api.updateService(editingService.id, formData);
      } else {
        await api.createService(formData);
      }
      setIsModalOpen(false);
      await fetchServices();
    } catch (err) {
      setFormError(err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (svc) => {
    try {
      const updatedStatus = svc.is_active ? 0 : 1;
      await api.updateService(svc.id, { is_active: updatedStatus });
      await fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete or deactivate this service?')) return;
    try {
      const res = await api.deleteService(id);
      alert(res.message);
      await fetchServices();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-light text-[#181715]">
            Services Management
          </h2>
          <p className="text-xs text-[#736E67] font-light">
            Configure treatment catalog, active status, durations, and pricing.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="luxury-button-primary text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-[#ECE7DE] rounded-xs shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-[#8C8780]">
            Loading Treatments...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-[#ECE7DE] text-[#8C8780] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Treatment</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Target</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DE]">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {svc.image_url && (
                          <div className="w-10 h-10 rounded-xs overflow-hidden bg-[#ECE7DE] shrink-0">
                            <img src={svc.image_url} alt={svc.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-[#181715] block">
                            {svc.name}
                          </span>
                          <span className="text-[11px] text-[#8C8780] line-clamp-1">
                            {svc.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-[#4A4744]">
                      {svc.category}
                    </td>
                    <td className="px-5 py-4 font-medium text-[#4A4744]">
                      {svc.gender}
                    </td>
                    <td className="px-5 py-4 font-editorial text-sm font-semibold text-[#181715]">
                      {formatCurrency(svc.price)}
                    </td>
                    <td className="px-5 py-4 text-[#736E67]">
                      {svc.duration_min} mins
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(svc)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border flex items-center gap-1.5 transition-colors ${
                          svc.is_active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${svc.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        <span>{svc.is_active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(svc)}
                          title="Edit Service"
                          className="p-1.5 text-[#736E67] hover:text-[#181715] hover:bg-[#F5F2EB] rounded-xs"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(svc.id)}
                          title="Delete or Deactivate"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#ECE7DE] rounded-xs max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#8C8780] hover:text-[#181715]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
              {editingService ? 'Edit Treatment' : 'Add New Treatment'}
            </span>
            <h3 className="font-editorial text-2xl font-light text-[#181715] mt-1 mb-6">
              {editingService ? editingService.name : 'Create Atelier Service'}
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Signature Balayage"
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] bg-white"
                  >
                    <option value="HAIR">Hair</option>
                    <option value="SKIN">Skin</option>
                    <option value="NAILS">Nails</option>
                    <option value="MAKEUP">Makeup</option>
                    <option value="GROOMING">Grooming</option>
                    <option value="SPA">Spa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Target Audience *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] bg-white"
                  >
                    <option value="UNISEX">Unisex</option>
                    <option value="MEN">Men</option>
                    <option value="WOMEN">Women</option>
                  </select>
                </div>
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
                    placeholder="899"
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.duration_min}
                    onChange={(e) => setFormData({ ...formData, duration_min: e.target.value })}
                    placeholder="45"
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed ritual description..."
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] resize-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="luxury-button-primary w-full text-xs py-3"
                >
                  {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
