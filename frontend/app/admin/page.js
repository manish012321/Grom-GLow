// frontend/app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import StatCard from '@/components/admin/StatCard';
import AppointmentModal from '@/components/admin/AppointmentModal';
import {
  Calendar,
  IndianRupee,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  Check,
  Ban,
  CheckCheck,
  TrendingUp,
  Scissors
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal detail
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const todayIso = new Date().toISOString().split('T')[0];

      const [analyticsRes, appointmentsRes] = await Promise.all([
        api.getAnalytics(),
        api.getAppointments({ date: todayIso })
      ]);

      setAnalytics(analyticsRes.data || null);
      setTodayAppointments(appointmentsRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setStatusUpdating(true);
      await api.updateAppointmentStatus(appointmentId, newStatus);
      await fetchDashboardData();
      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setStatusUpdating(false);
    }
  };

  const metrics = analytics?.metrics || {
    todayAppointments: 0,
    todayRevenue: 0,
    totalCustomers: 0,
    totalCompleted: 0
  };

  const statusColors = {
    CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    NO_SHOW: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-light text-[#181715]">
            GOOD MORNING 👋
          </h2>
          <p className="text-xs text-[#736E67] mt-1 font-light">
            Here&apos;s what&apos;s happening on the atelier floor today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/appointments"
            className="text-xs font-semibold px-4 py-2 bg-white border border-[#ECE7DE] rounded-xs text-[#181715] hover:border-[#181715] transition-colors"
          >
            All Appointments
          </Link>
          <Link
            href="/book"
            target="_blank"
            className="text-xs font-semibold px-4 py-2 bg-[#181715] text-[#FDFBF7] rounded-xs hover:bg-[#C5A880] hover:text-[#181715] transition-colors flex items-center gap-1.5"
          >
            <span>New Booking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Today's Appointments"
          value={metrics.todayAppointments}
          subtitle="Scheduled reservations"
          icon={Calendar}
          color="champagne"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(metrics.todayRevenue)}
          subtitle="From confirmed visits"
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard
          title="Total Customers"
          value={metrics.totalCustomers}
          subtitle="Active salon accounts"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={metrics.totalCompleted}
          subtitle="Services finalized"
          icon={CheckCircle2}
          color="charcoal"
        />
      </div>

      {/* 3. Today's Appointments Schedule Table */}
      <div className="bg-white border border-[#ECE7DE] rounded-xs shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#ECE7DE] flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-xl text-[#181715] font-normal">
              Today&apos;s Appointments
            </h3>
            <p className="text-xs text-[#8C8780] font-light">
              Live schedule queue for today
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs text-[#C5A880] font-semibold hover:underline flex items-center gap-1"
          >
            <span>View Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#8C8780]">
            Syncing Today&apos;s Schedule...
          </div>
        ) : todayAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-[#ECE7DE] text-[#8C8780] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Stylist</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DE]">
                {todayAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#181715]">
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
                      <div className="text-[11px] text-[#C5A880] font-medium">
                        {formatCurrency(app.service_price)}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-[#4A4744]">
                      {app.stylist_name}
                    </td>
                    <td className="px-5 py-4 font-medium text-[#181715]">
                      {formatTime(app.start_time)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAppointment(app)}
                          title="View Details"
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
          <div className="p-12 text-center">
            <Clock className="w-8 h-8 text-[#A6A19A] mx-auto mb-2" />
            <h4 className="font-editorial text-lg text-[#181715]">
              No appointments today.
            </h4>
            <p className="text-xs text-[#736E67] mt-0.5">
              Your schedule is clear.
            </p>
          </div>
        )}
      </div>

      {/* 4. Analytics Breakdown: Popular Services & Stylists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Services */}
        <div className="bg-white border border-[#ECE7DE] rounded-xs p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ECE7DE]">
            <div>
              <h3 className="font-editorial text-xl font-normal text-[#181715]">
                Popular Services
              </h3>
              <p className="text-xs text-[#8C8780]">Highest client booking volume</p>
            </div>
            <Scissors className="w-5 h-5 text-[#C5A880]" />
          </div>

          <div className="space-y-4">
            {analytics?.popularServices?.map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#F5F2EB] flex items-center justify-center font-bold text-[10px] text-[#736E67]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-medium text-[#181715] block">{s.name}</span>
                    <span className="text-[10px] text-[#8C8780]">{s.category} • {formatCurrency(s.price)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#181715] block">{s.booking_count} bookings</span>
                  <span className="text-[10px] text-emerald-600">{formatCurrency(s.total_revenue || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Stylists */}
        <div className="bg-white border border-[#ECE7DE] rounded-xs p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ECE7DE]">
            <div>
              <h3 className="font-editorial text-xl font-normal text-[#181715]">
                Top Performing Stylists
              </h3>
              <p className="text-xs text-[#8C8780]">Reservations by artisan</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#C5A880]" />
          </div>

          <div className="space-y-4">
            {analytics?.popularStylists?.map((st) => (
              <div key={st.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-[#ECE7DE] border border-[#ECE7DE] shrink-0">
                    <img src={st.image_url} alt={st.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-medium text-[#181715] block">{st.name}</span>
                    <span className="text-[10px] text-[#8C8780]">Salon Specialist</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#181715]">{st.booking_count} Appointments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onStatusChange={handleStatusChange}
          updating={statusUpdating}
        />
      )}
    </div>
  );
}
