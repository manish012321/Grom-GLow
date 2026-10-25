// frontend/components/BookingWizard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime, createGoogleCalendarUrl } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  AlertCircle,
  MessageCircle,
  CalendarPlus,
  Loader2
} from 'lucide-react';

export default function BookingWizard() {
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get('service');
  const preselectedStylistId = searchParams.get('stylist');

  // Step state: 1: Service, 2: Stylist, 3: Date & Time, 4: Details, 5: Confirmation
  const [step, setStep] = useState(1);

  // Data state
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Selection state
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null); // null = "Any Stylist"

  // Date and slots state
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(tomorrowStr);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  // Customer details state
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Completed booking state
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Fetch services and stylists on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingInitial(true);
        const [servicesRes, stylistsRes] = await Promise.all([
          api.getServices({ activeOnly: 'true' }),
          api.getStylists({ activeOnly: 'true' })
        ]);

        const svcs = servicesRes.data || [];
        const sts = stylistsRes.data || [];
        setServices(svcs);
        setStylists(sts);

        if (preselectedServiceId) {
          const matchedSvc = svcs.find(s => s.id === parseInt(preselectedServiceId, 10) || s.slug === preselectedServiceId);
          if (matchedSvc) {
            setSelectedService(matchedSvc);
            setStep(2);
          }
        }

        if (preselectedStylistId) {
          const matchedSt = sts.find(st => st.id === parseInt(preselectedStylistId, 10));
          if (matchedSt) {
            setSelectedStylist(matchedSt);
          }
        }
      } catch (err) {
        console.error('Failed to load booking data:', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadData();
  }, [preselectedServiceId, preselectedStylistId]);

  // Load available slots whenever stylist, date, or service changes
  useEffect(() => {
    if (!selectedService || !selectedDate) return;

    async function fetchSlots() {
      try {
        setLoadingSlots(true);
        setSelectedTime('');
        const stylistId = selectedStylist ? selectedStylist.id : 'any';
        const res = await api.getStylistSlots(stylistId, selectedDate, selectedService.duration_min);
        setAvailableSlots(res.data?.slots || []);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    if (step === 3) {
      fetchSlots();
    }
  }, [selectedStylist, selectedDate, selectedService, step]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleStylistSelect = (stylist) => {
    setSelectedStylist(stylist); // can be null for 'any'
    setStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleProceedToDetails = () => {
    if (!selectedTime) {
      setFormError('Please choose a time slot to continue.');
      return;
    }
    setFormError('');
    setStep(4);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!customerDetails.name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!customerDetails.phone.trim() || customerDetails.phone.replace(/[^0-9]/g, '').length < 8) {
      setFormError('Please enter a valid phone number with area code.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        serviceId: selectedService.id,
        stylistId: selectedStylist ? selectedStylist.id : 'any',
        date: selectedDate,
        startTime: selectedTime,
        customer: customerDetails,
        notes: customerDetails.notes
      };

      const res = await api.createAppointment(payload);
      if (res.success) {
        setConfirmedBooking(res.data);
        setStep(5);
      } else {
        setFormError(res.message || 'Unable to confirm appointment. Please try again.');
      }
    } catch (err) {
      setFormError(err.message || 'Something went wrong while confirming your booking.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter services
  const filteredServices = services.filter((s) => {
    const matchCategory = categoryFilter === 'ALL' || s.category === categoryFilter;
    const matchGender = genderFilter === 'ALL' || s.gender === genderFilter || s.gender === 'UNISEX';
    return matchCategory && matchGender;
  });

  const categories = ['ALL', 'HAIR', 'SKIN', 'NAILS', 'MAKEUP', 'GROOMING', 'SPA'];

  // Next 14 days generator for date picker
  const datesList = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() + (i + 1) * 86400000);
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return { iso, dayName, dayNum };
  });

  if (loadingInitial) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C5A880]" />
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#8C8780]">
          Preparing Booking Sanctuary...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-[#ECE7DE] shadow-xl rounded-xs overflow-hidden">
      {/* Wizard Progress Indicator */}
      {step < 5 && (
        <div className="border-b border-[#ECE7DE] bg-[#FDFBF7] px-6 py-4">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Specialist' },
              { num: 3, label: 'Date & Time' },
              { num: 4, label: 'Details' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <button
                  type="button"
                  disabled={step < s.num}
                  onClick={() => s.num < step && setStep(s.num)}
                  className={`flex items-center gap-2 text-xs uppercase tracking-wider font-medium transition-colors ${
                    step === s.num
                      ? 'text-[#181715] font-bold'
                      : step > s.num
                      ? 'text-[#C5A880] cursor-pointer hover:underline'
                      : 'text-[#B8B3AC] cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                      step === s.num
                        ? 'bg-[#181715] text-[#FDFBF7]'
                        : step > s.num
                        ? 'bg-[#C5A880] text-[#181715]'
                        : 'bg-[#EAE5DC] text-[#8C8780]'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {idx < 3 && <ChevronRight className="w-4 h-4 text-[#D6D0C5] mx-2 sm:mx-4" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: CHOOSE SERVICE */}
      {step === 1 && (
        <div className="p-6 sm:p-10">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              Step 1 of 4
            </span>
            <h2 className="font-editorial text-3xl font-light text-[#181715] mt-1">
              Select Your Treatment
            </h2>
            <p className="text-xs text-[#736E67] mt-2 font-light">
              Choose from our bespoke salon, skincare, and grooming rituals.
            </p>
          </div>

          {/* Gender Filter */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-[#F5F2EB] rounded-xs border border-[#ECE7DE]">
              {['ALL', 'MEN', 'WOMEN', 'UNISEX'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                    genderFilter === g
                      ? 'bg-[#181715] text-[#FDFBF7] shadow-xs'
                      : 'text-[#736E67] hover:text-[#181715]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none justify-start sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors border ${
                  categoryFilter === cat
                    ? 'border-[#181715] bg-[#181715] text-[#FDFBF7]'
                    : 'border-[#ECE7DE] bg-white text-[#736E67] hover:border-[#C5A880]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((svc) => (
              <div
                key={svc.id}
                onClick={() => handleServiceSelect(svc)}
                className="group relative p-5 border border-[#ECE7DE] hover:border-[#C5A880] bg-[#FDFBF7] hover:bg-white transition-all cursor-pointer rounded-xs flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  {svc.image_url && (
                    <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xs bg-[#ECE7DE]">
                      <img
                        src={svc.image_url}
                        alt={svc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold">
                        {svc.category}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#A6A19A]">
                        • {svc.gender}
                      </span>
                    </div>
                    <h3 className="font-editorial text-lg text-[#181715] font-normal mt-0.5 leading-snug">
                      {svc.name}
                    </h3>
                    <p className="text-xs text-[#736E67] line-clamp-2 mt-1 font-light">
                      {svc.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#ECE7DE]">
                  <div className="flex items-center gap-3 text-xs text-[#736E67]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      {svc.duration_min} mins
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-editorial text-lg font-semibold text-[#181715]">
                      {formatCurrency(svc.price)}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#C5A880] group-hover:translate-x-0.5 transition-transform">
                      Select →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="py-16 text-center text-[#736E67]">
              <p className="text-sm">No treatments match your selected filters.</p>
              <button
                onClick={() => { setCategoryFilter('ALL'); setGenderFilter('ALL'); }}
                className="mt-3 text-xs uppercase tracking-wider text-[#C5A880] underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: CHOOSE STYLIST */}
      {step === 2 && (
        <div className="p-6 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#736E67] hover:text-[#181715]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </button>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                Selected: {selectedService?.name}
              </span>
            </div>
          </div>

          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              Step 2 of 4
            </span>
            <h2 className="font-editorial text-3xl font-light text-[#181715] mt-1">
              Choose Your Artisan
            </h2>
            <p className="text-xs text-[#736E67] mt-2 font-light">
              Select an expert specialist or let us assign the earliest available senior stylist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Any Specialist Option */}
            <div
              onClick={() => handleStylistSelect(null)}
              className="p-6 border-2 border-dashed border-[#ECE7DE] hover:border-[#181715] bg-[#FDFBF7] hover:bg-white transition-all cursor-pointer rounded-xs flex items-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-[#181715] text-[#FDFBF7] flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-editorial text-xl text-[#181715]">
                  Any Available Specialist
                </h3>
                <p className="text-xs text-[#736E67] mt-1 font-light">
                  Maximum slot availability. We will allocate the top senior stylist free at your desired hour.
                </p>
                <span className="inline-block mt-3 text-xs uppercase tracking-wider font-semibold text-[#C5A880]">
                  Select Any Available →
                </span>
              </div>
            </div>

            {/* Individual Stylists */}
            {stylists.map((st) => (
              <div
                key={st.id}
                onClick={() => handleStylistSelect(st)}
                className="p-6 border border-[#ECE7DE] hover:border-[#C5A880] bg-[#FDFBF7] hover:bg-white transition-all cursor-pointer rounded-xs flex items-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#ECE7DE]">
                  <img
                    src={st.image_url}
                    alt={st.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-xl text-[#181715]">
                      {st.name}
                    </h3>
                    <span className="text-[10px] text-[#A6A19A] font-medium">
                      {st.experience_years} yrs exp
                    </span>
                  </div>
                  <p className="text-xs text-[#736E67] line-clamp-1 mt-1 font-light">
                    {st.specialties}
                  </p>
                  <span className="inline-block mt-3 text-xs uppercase tracking-wider font-semibold text-[#C5A880]">
                    Select {st.name.split(' ')[0]} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: CHOOSE DATE & TIME */}
      {step === 3 && (
        <div className="p-6 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#736E67] hover:text-[#181715]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Stylist
            </button>
            <div className="text-right text-xs text-[#736E67]">
              <span>{selectedService?.name}</span> •{' '}
              <span className="font-medium text-[#181715]">
                {selectedStylist ? selectedStylist.name : 'Any Available Specialist'}
              </span>
            </div>
          </div>

          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              Step 3 of 4
            </span>
            <h2 className="font-editorial text-3xl font-light text-[#181715] mt-1">
              Select Date & Hour
            </h2>
            <p className="text-xs text-[#736E67] mt-2 font-light">
              Live salon availability synchronized with stylist schedules.
            </p>
          </div>

          {/* Date Picker Horizontal Strip */}
          <div className="mb-8">
            <label className="block text-xs uppercase tracking-widest text-[#736E67] font-semibold mb-3">
              Appointment Date
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-3">
              {datesList.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className={`shrink-0 w-20 py-3 rounded-xs border text-center transition-all ${
                    selectedDate === d.iso
                      ? 'border-[#181715] bg-[#181715] text-[#FDFBF7] shadow-sm'
                      : 'border-[#ECE7DE] bg-[#FDFBF7] text-[#736E67] hover:border-[#C5A880]'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                    {d.dayName}
                  </div>
                  <div className="text-sm font-bold mt-1 font-editorial">
                    {d.dayNum}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-widest text-[#736E67] font-semibold">
                Available Times on {formatDate(selectedDate)}
              </label>
              <span className="text-xs text-[#A6A19A]">
                {selectedService?.duration_min} min service
              </span>
            </div>

            {loadingSlots ? (
              <div className="py-12 text-center text-[#736E67]">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C5A880]" />
                <p className="text-xs mt-3">Computing open appointment slots...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSelect(slot.time)}
                      className={`py-3 px-2 text-xs font-medium rounded-xs border transition-all text-center ${
                        isSelected
                          ? 'border-[#C5A880] bg-[#C5A880] text-[#181715] font-bold shadow-md'
                          : 'border-[#ECE7DE] bg-white text-[#181715] hover:border-[#181715]'
                      }`}
                    >
                      {formatTime(slot.time)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-[#ECE7DE] bg-[#FDFBF7]">
                <Clock className="w-8 h-8 text-[#A6A19A] mx-auto mb-2" />
                <p className="text-sm font-editorial text-[#181715]">
                  No remaining slots on this date.
                </p>
                <p className="text-xs text-[#736E67] mt-1">
                  Please pick another date from the strip above.
                </p>
              </div>
            )}
          </div>

          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-[#ECE7DE]">
            <button
              onClick={handleProceedToDetails}
              disabled={!selectedTime}
              className={`luxury-button-primary ${
                !selectedTime ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <span>Continue to Guest Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CUSTOMER DETAILS & REVIEW */}
      {step === 4 && (
        <div className="p-6 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#736E67] hover:text-[#181715]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Time Selection
            </button>
          </div>

          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              Final Step
            </span>
            <h2 className="font-editorial text-3xl font-light text-[#181715] mt-1">
              Guest Information
            </h2>
            <p className="text-xs text-[#736E67] mt-2 font-light">
              We need just your primary contact details to prepare your reservation.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="mb-8 p-6 bg-[#FDFBF7] border border-[#ECE7DE] rounded-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-[#ECE7DE]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A6A19A]">Treatment</span>
                <p className="font-editorial text-lg text-[#181715] mt-0.5">{selectedService?.name}</p>
                <span className="text-xs text-[#736E67]">{selectedService?.duration_min} minutes</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A6A19A]">Specialist</span>
                <p className="font-editorial text-lg text-[#181715] mt-0.5">
                  {selectedStylist ? selectedStylist.name : 'Senior Specialist Assigned'}
                </p>
                <span className="text-xs text-[#C5A880] font-medium">Groom & Glow Atelier</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A6A19A]">Schedule</span>
                <p className="font-editorial text-lg text-[#181715] mt-0.5">{formatDate(selectedDate)}</p>
                <span className="text-xs font-semibold text-[#181715]">{formatTime(selectedTime)}</span>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#736E67]">Payable at Salon</span>
              <span className="font-editorial text-2xl font-semibold text-[#181715]">
                {formatCurrency(selectedService?.price)}
              </span>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#181715] font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#181715] font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98201 XXXXX"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#181715] font-semibold mb-2">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="your.email@domain.com"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                className="w-full px-4 py-3 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#181715] font-semibold mb-2">
                Special Notes / Beverage / Scalp Sensitivity (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="First time visiting, scalp preferences, iced espresso, etc."
                value={customerDetails.notes}
                onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                className="w-full px-4 py-3 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715] bg-white resize-none"
              />
            </div>

            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="luxury-button-primary w-full py-4 text-xs tracking-[0.2em]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Reservation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Appointment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 5: APPOINTMENT CONFIRMED */}
      {step === 5 && confirmedBooking && (
        <div className="p-8 sm:p-14 text-center">
          <div className="w-16 h-16 bg-[#F2EAE0] text-[#C5A880] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
            Reservation Secured
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#181715] mt-2">
            Appointment Confirmed
          </h2>
          <p className="text-sm text-[#736E67] mt-3 max-w-md mx-auto font-light">
            We are honored to welcome you. Your time slot has been secured on our atelier floor.
          </p>

          <div className="my-8 max-w-md mx-auto p-6 bg-[#FDFBF7] border border-[#ECE7DE] rounded-xs text-left">
            <div className="flex justify-between items-center pb-4 border-b border-[#ECE7DE]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A6A19A]">Booking ID</span>
                <p className="font-editorial text-2xl font-bold text-[#181715]">
                  {confirmedBooking.appointment?.bookingCode}
                </p>
              </div>
              <span className="champagne-badge">Confirmed</span>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#736E67]">Service:</span>
                <span className="font-medium text-[#181715]">{confirmedBooking.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#736E67]">Specialist:</span>
                <span className="font-medium text-[#181715]">{confirmedBooking.stylist?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#736E67]">Date:</span>
                <span className="font-medium text-[#181715]">{formatDate(confirmedBooking.appointment?.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#736E67]">Time:</span>
                <span className="font-medium text-[#181715]">{formatTime(confirmedBooking.appointment?.startTime)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#ECE7DE]">
                <span className="text-[#736E67]">Amount Payable:</span>
                <span className="font-editorial text-lg font-semibold text-[#181715]">
                  {formatCurrency(confirmedBooking.service?.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {/* Add to Google Calendar */}
            <a
              href={createGoogleCalendarUrl({
                title: `Groom & Glow: ${confirmedBooking.service?.name} with ${confirmedBooking.stylist?.name}`,
                description: `Appointment Ref: ${confirmedBooking.appointment?.bookingCode}\nService: ${confirmedBooking.service?.name}\nStylist: ${confirmedBooking.stylist?.name}`,
                date: confirmedBooking.appointment?.date,
                startTime: confirmedBooking.appointment?.startTime,
                endTime: confirmedBooking.appointment?.endTime
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-button-secondary w-full text-center"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Add to Calendar</span>
            </a>

            {/* WhatsApp button */}
            <a
              href={confirmedBooking.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-button-primary w-full text-center bg-[#25D366] border-[#25D366] text-white hover:bg-[#1EBE5D] hover:text-white"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                setStep(1);
                setSelectedService(null);
                setSelectedStylist(null);
                setSelectedTime('');
                setConfirmedBooking(null);
              }}
              className="text-xs uppercase tracking-wider text-[#736E67] hover:text-[#181715] underline underline-offset-4"
            >
              Book Another Treatment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
