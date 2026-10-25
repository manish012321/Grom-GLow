// frontend/app/admin/appointments/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import AppointmentModal from '@/components/admin/AppointmentModal';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Eye,
  Check,
  Ban,
  CheckCheck,
  Clock,
  User,
  Scissors
} from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [viewMode, setViewMode] = useState('TABLE'); // 'TABLE' or 'DAY' or 'WEEK'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stylistFilter, setStylistFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail Modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (stylistFilter !== 'ALL') params.stylistId = stylistFilter;
      if (dateFilter) params.date = dateFilter;
      if (searchQuery) params.search = searchQuery;

      const [appRes, stRes] = await Promise.all([
        api.getAppointments(params),
        api.getStylists()
      ]);

      setAppointments(appRes.data || []);
      setStylists(stRes.data || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, stylistFilter, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAppointments();
  };

  const handleStatusChange = async (id, status) => {
    try {
      setUpdating(true);
      await api.updateAppointmentStatus(id, status);
      await fetchAppointments();
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment(prev => ({ ...prev, status }));
      }
    } catch (err) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    NO_SHOW: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div className="space-y-6">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-light text-[#181715]">
            Appointments Directory
          </h2>
          <p className="text-xs text-[#736E67] font-light">
            Monitor, confirm, and update customer visits across all salon floors.
          </p>
        </div>

        {/* View Mode Toggle: Table vs Calendar day view */}
        <div className="inline-flex p-1 bg-white rounded-xs border border-[#ECE7DE]">
          {['TABLE', 'DAY', 'WEEK'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                viewMode === mode
                  ? 'bg-[#181715] text-[#FDFBF7]'
                  : 'text-[#736E67] hover:text-[#181715]'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#ECE7DE] rounded-xs p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#8C8780] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, phone, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
            />
          </form>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No-Show</option>
          </select>

          {/* Stylist Filter */}
          <select
            value={stylistFilter}
            onChange={(e) => setStylistFilter(e.target.value)}
            className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] bg-white"
          >
            <option value="ALL">All Stylists</option>
            {stylists.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715] bg-white"
          />
        </div>

        {(statusFilter !== 'ALL' || stylistFilter !== 'ALL' || dateFilter || searchQuery) && (
          <div className="mt-3 pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#736E67]">
            <span>Filtered results</span>
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setStylistFilter('ALL');
                setDateFilter('');
                setSearchQuery('');
              }}
              className="text-[#C5A880] hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Appointments View */}
      {viewMode === 'TABLE' ? (
        <div className="bg-white border border-[#ECE7DE] rounded-xs shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-xs text-[#8C8780]">
              Loading Appointments Directory...
            </div>
          ) : appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] border-b border-[#ECE7DE] text-[#8C8780] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Code</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Service</th>
                    <th className="px-5 py-3.5">Specialist</th>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE7DE]">
                  {appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-[#181715]">
                        {app.booking_code}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#181715]">
                          {app.customer_name}
                        </div>
                        <div className="text-[11px] text-[#8C8780]">
                          {app.customer_phone}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-[#181715]">
                          {app.service_name}
                        </div>
                        <div className="text-[11px] text-[#C5A880] font-semibold">
                          {formatCurrency(app.service_price)}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-[#4A4744]">
                        {app.stylist_name}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-[#181715]">
                          {formatDate(app.date)}
                        </div>
                        <div className="text-[11px] text-[#8C8780]">
                          {formatTime(app.start_time)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusColors[app.status] || 'bg-gray-100'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAppointment(app)}
                            title="Inspect Booking Details"
                            className="p-1.5 text-[#736E67] hover:text-[#181715] hover:bg-[#F5F2EB] rounded-xs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {app.status !== 'CONFIRMED' && app.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'CONFIRMED')}
                              title="Confirm"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xs"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {app.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'COMPLETED')}
                              title="Mark Completed"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-xs"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}

                          {app.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'CANCELLED')}
                              title="Cancel"
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-xs"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <CalendarIcon className="w-8 h-8 text-[#A6A19A] mx-auto mb-2" />
              <h4 className="font-editorial text-lg text-[#181715]">
                No appointments found.
              </h4>
              <p className="text-xs text-[#736E67] mt-0.5">
                Try clearing or adjusting your filter criteria.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Calendar / Time-slot schedule cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedAppointment(app)}
              className="p-5 bg-white border border-[#ECE7DE] hover:border-[#C5A880] rounded-xs cursor-pointer shadow-xs transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-[#181715]">
                  {app.booking_code}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </div>

              <div className="font-editorial text-lg text-[#181715]">
                {app.customer_name}
              </div>
              <p className="text-xs text-[#736E67] mt-0.5">{app.service_name}</p>

              <div className="mt-4 pt-3 border-t border-[#ECE7DE] flex items-center justify-between text-xs text-[#8C8780]">
                <span>{app.stylist_name}</span>
                <span className="font-semibold text-[#181715]">
                  {formatDate(app.date)} • {formatTime(app.start_time)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  );
}
