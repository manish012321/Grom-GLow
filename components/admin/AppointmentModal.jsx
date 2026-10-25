// frontend/components/admin/AppointmentModal.jsx
'use client';

import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { X, Check, CheckCheck, Ban, Clock, User, Scissors, Calendar, AlertCircle } from 'lucide-react';

export default function AppointmentModal({ appointment, onClose, onStatusChange, updating }) {
  if (!appointment) return null;

  const statusColors = {
    CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    NO_SHOW: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#ECE7DE] rounded-xs max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8C8780] hover:text-[#181715]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#ECE7DE]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#8C8780] font-semibold">
              Reservation Details
            </span>
            <h3 className="font-editorial text-2xl font-bold text-[#181715]">
              {appointment.booking_code}
            </h3>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${statusColors[appointment.status] || 'bg-gray-100 text-gray-700'}`}>
            {appointment.status}
          </span>
        </div>

        <div className="space-y-5 text-sm">
          {/* Customer */}
          <div className="p-4 bg-[#FDFBF7] border border-[#ECE7DE] rounded-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#8C8780] font-semibold block mb-1">
              Customer
            </span>
            <div className="font-editorial text-xl font-medium text-[#181715]">
              {appointment.customer_name}
            </div>
            <div className="text-xs text-[#4A4744] mt-0.5">
              {appointment.customer_phone}
            </div>
            {appointment.customer_email && (
              <div className="text-xs text-[#8C8780]">
                {appointment.customer_email}
              </div>
            )}
          </div>

          {/* Service & Stylist Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#FDFBF7] border border-[#ECE7DE] rounded-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#8C8780] font-semibold block mb-1">
                Service
              </span>
              <div className="font-medium text-[#181715]">
                {appointment.service_name}
              </div>
              <div className="text-xs text-[#C5A880] font-bold mt-1">
                {formatCurrency(appointment.service_price)}
              </div>
              <div className="text-xs text-[#8C8780]">
                {appointment.service_duration} minutes
              </div>
            </div>

            <div className="p-4 bg-[#FDFBF7] border border-[#ECE7DE] rounded-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#8C8780] font-semibold block mb-1">
                Stylist
              </span>
              <div className="font-medium text-[#181715]">
                {appointment.stylist_name}
              </div>
              <div className="text-xs text-[#8C8780] mt-1">
                Groom & Glow Specialist
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8C8780] font-semibold block mb-0.5">
                Date
              </span>
              <div className="text-sm font-medium text-[#181715]">
                {formatDate(appointment.date)}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8C8780] font-semibold block mb-0.5">
                Time
              </span>
              <div className="text-sm font-medium text-[#181715]">
                {formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="p-3 bg-[#F5F2EB] rounded-xs text-xs text-[#4A4744]">
              <strong className="block text-[#181715] mb-0.5">Notes:</strong>
              {appointment.notes}
            </div>
          )}
        </div>

        {/* Status Actions */}
        <div className="pt-6 mt-6 border-t border-[#ECE7DE]">
          <span className="text-[10px] uppercase tracking-widest text-[#8C8780] font-semibold block mb-3">
            Change Appointment Status
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onStatusChange(appointment.id, 'CONFIRMED')}
              disabled={updating || appointment.status === 'CONFIRMED'}
              className="px-3 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xs hover:bg-emerald-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm</span>
            </button>

            <button
              onClick={() => onStatusChange(appointment.id, 'COMPLETED')}
              disabled={updating || appointment.status === 'COMPLETED'}
              className="px-3 py-2 text-xs font-semibold bg-[#181715] text-[#FDFBF7] rounded-xs hover:bg-[#C5A880] hover:text-[#181715] disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Complete</span>
            </button>

            <button
              onClick={() => onStatusChange(appointment.id, 'CANCELLED')}
              disabled={updating || appointment.status === 'CANCELLED'}
              className="px-3 py-2 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-xs hover:bg-red-100 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            <button
              onClick={() => onStatusChange(appointment.id, 'NO_SHOW')}
              disabled={updating || appointment.status === 'NO_SHOW'}
              className="px-3 py-2 text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 rounded-xs hover:bg-gray-200 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>No-Show</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
