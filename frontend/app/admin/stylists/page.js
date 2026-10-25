// frontend/app/admin/stylists/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Edit2, Trash2, Calendar, Clock, X, Check, Award, Phone } from 'lucide-react';

export default function AdminStylistsPage() {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stylist Edit Modal
  const [isStylistModalOpen, setIsStylistModalOpen] = useState(false);
  const [editingStylist, setEditingStylist] = useState(null);
  const [stylistForm, setStylistForm] = useState({
    name: '',
    bio: '',
    experience_years: 5,
    specialties: '',
    image_url: '',
    phone: '',
    is_active: 1
  });

  // Schedule Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleStylist, setScheduleStylist] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const fetchStylists = async () => {
    try {
      setLoading(true);
      const res = await api.getStylists();
      setStylists(res.data || []);
    } catch (err) {
      console.error('Failed to load stylists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStylists();
  }, []);

  const handleOpenCreate = () => {
    setEditingStylist(null);
    setStylistForm({
      name: '',
      bio: '',
      experience_years: 5,
      specialties: '',
      image_url: '',
      phone: '',
      is_active: 1
    });
    setIsStylistModalOpen(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStylist(st);
    setStylistForm({
      name: st.name,
      bio: st.bio || '',
      experience_years: st.experience_years,
      specialties: st.specialties || '',
      image_url: st.image_url || '',
      phone: st.phone || '',
      is_active: st.is_active ? 1 : 0
    });
    setIsStylistModalOpen(true);
  };

  const handleOpenSchedule = async (st) => {
    try {
      const res = await api.getStylistById(st.id);
      setScheduleStylist(res.data);
      setSchedules(res.data?.schedules || []);
      setIsScheduleModalOpen(true);
    } catch (err) {
      alert('Failed to load stylist schedule');
    }
  };

  const handleSaveStylist = async (e) => {
    e.preventDefault();
    try {
      if (editingStylist) {
        await api.updateStylist(editingStylist.id, stylistForm);
      } else {
        await api.createStylist(stylistForm);
      }
      setIsStylistModalOpen(false);
      await fetchStylists();
    } catch (err) {
      alert(err.message || 'Failed to save stylist');
    }
  };

  const handleScheduleChange = (dayIdx, field, val) => {
    const updated = [...schedules];
    updated[dayIdx] = { ...updated[dayIdx], [field]: val };
    setSchedules(updated);
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    try {
      setSavingSchedule(true);
      await api.updateStylistSchedule(scheduleStylist.id, schedules);
      alert('Stylist working hours updated successfully.');
      setIsScheduleModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to update schedule');
    } finally {
      setSavingSchedule(false);
    }
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-light text-[#181715]">
            Stylists & Availability
          </h2>
          <p className="text-xs text-[#736E67] font-light">
            Manage artisans, specialties, working hours, break times, and days off.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="luxury-button-primary text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stylist</span>
        </button>
      </div>

      {/* Stylists Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-[#8C8780]">
          Loading Stylists...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stylists.map((st) => (
            <div
              key={st.id}
              className="bg-white border border-[#ECE7DE] rounded-xs p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#ECE7DE] border border-[#ECE7DE] shrink-0">
                    <img src={st.image_url} alt={st.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-editorial text-xl text-[#181715]">
                        {st.name}
                      </h3>
                      <span className={`w-2 h-2 rounded-full ${st.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    </div>
                    <span className="text-[10px] text-[#A6A19A] block mt-0.5">
                      {st.experience_years} Years Experience
                    </span>
                    {st.phone && (
                      <span className="text-xs text-[#736E67] block mt-1">
                        {st.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C8780] font-semibold block mb-1">
                    Specialties
                  </span>
                  <p className="text-xs text-[#4A4744] font-medium">
                    {st.specialties || 'All Unisex Services'}
                  </p>
                </div>

                <p className="text-xs text-[#736E67] line-clamp-2 font-light">
                  {st.bio}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-[#ECE7DE] flex items-center justify-between">
                <button
                  onClick={() => handleOpenSchedule(st)}
                  className="text-xs text-[#C5A880] font-semibold hover:underline flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Configure Schedule</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(st)}
                    className="p-1.5 text-[#736E67] hover:text-[#181715] hover:bg-[#F5F2EB] rounded-xs"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCHEDULE CONFIGURATION MODAL */}
      {isScheduleModalOpen && scheduleStylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#ECE7DE] rounded-xs max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsScheduleModalOpen(false)}
              className="absolute top-6 right-6 text-[#8C8780] hover:text-[#181715]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
              Weekly Availability Engine
            </span>
            <h3 className="font-editorial text-2xl font-light text-[#181715] mt-1 mb-1">
              Working Hours: {scheduleStylist.name}
            </h3>
            <p className="text-xs text-[#736E67] mb-6 font-light">
              Booking engine automatically computes available 30-min slots based on these hours, subtracting breaks and existing reservations.
            </p>

            <form onSubmit={handleSaveSchedule} className="space-y-3">
              {schedules.map((s, idx) => (
                <div
                  key={s.day_of_week}
                  className={`p-3 rounded-xs border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    s.is_day_off ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-[#FDFBF7] border-[#ECE7DE]'
                  }`}
                >
                  <div className="w-24 font-bold text-[#181715]">
                    {daysOfWeek[s.day_of_week]}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-[#8C8780]">Hours:</label>
                    <input
                      type="time"
                      disabled={s.is_day_off}
                      value={s.start_time}
                      onChange={(e) => handleScheduleChange(idx, 'start_time', e.target.value)}
                      className="px-2 py-1 border rounded-xs bg-white text-xs"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      disabled={s.is_day_off}
                      value={s.end_time}
                      onChange={(e) => handleScheduleChange(idx, 'end_time', e.target.value)}
                      className="px-2 py-1 border rounded-xs bg-white text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-[#8C8780]">Break:</label>
                    <input
                      type="time"
                      disabled={s.is_day_off}
                      value={s.break_start || '13:00'}
                      onChange={(e) => handleScheduleChange(idx, 'break_start', e.target.value)}
                      className="px-2 py-1 border rounded-xs bg-white text-xs"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      disabled={s.is_day_off}
                      value={s.break_end || '14:00'}
                      onChange={(e) => handleScheduleChange(idx, 'break_end', e.target.value)}
                      className="px-2 py-1 border rounded-xs bg-white text-xs"
                    />
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.is_day_off === 1 || s.is_day_off === true}
                      onChange={(e) => handleScheduleChange(idx, 'is_day_off', e.target.checked ? 1 : 0)}
                      className="rounded border-[#ECE7DE]"
                    />
                    <span className="text-[11px] font-semibold text-red-600">Day Off</span>
                  </label>
                </div>
              ))}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 border rounded-xs text-xs font-semibold text-[#736E67]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSchedule}
                  className="luxury-button-primary text-xs py-2"
                >
                  {savingSchedule ? 'Saving...' : 'Save Weekly Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT STYLIST MODAL */}
      {isStylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#ECE7DE] rounded-xs max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsStylistModalOpen(false)}
              className="absolute top-6 right-6 text-[#8C8780] hover:text-[#181715]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
              Stylist Profile
            </span>
            <h3 className="font-editorial text-2xl font-light text-[#181715] mt-1 mb-6">
              {editingStylist ? 'Edit Stylist' : 'Add New Stylist'}
            </h3>

            <form onSubmit={handleSaveStylist} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={stylistForm.name}
                  onChange={(e) => setStylistForm({ ...stylistForm, name: e.target.value })}
                  placeholder="e.g. Meera Kapoor"
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={stylistForm.experience_years}
                    onChange={(e) => setStylistForm({ ...stylistForm, experience_years: e.target.value })}
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="tel"
                    value={stylistForm.phone}
                    onChange={(e) => setStylistForm({ ...stylistForm, phone: e.target.value })}
                    placeholder="+91 98201 XXXXX"
                    className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Specialties (Comma Separated)
                </label>
                <input
                  type="text"
                  value={stylistForm.specialties}
                  onChange={(e) => setStylistForm({ ...stylistForm, specialties: e.target.value })}
                  placeholder="Balayage, Precision Cuts, Scalp Therapy"
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={stylistForm.image_url}
                  onChange={(e) => setStylistForm({ ...stylistForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1">
                  Biography
                </label>
                <textarea
                  rows={3}
                  value={stylistForm.bio}
                  onChange={(e) => setStylistForm({ ...stylistForm, bio: e.target.value })}
                  placeholder="Artisan background, editorial accolades..."
                  className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] resize-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="luxury-button-primary w-full text-xs py-3"
                >
                  {editingStylist ? 'Update Profile' : 'Save Stylist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
