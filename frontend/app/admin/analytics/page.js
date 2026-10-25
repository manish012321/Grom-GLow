// frontend/app/admin/analytics/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import StatCard from '@/components/admin/StatCard';
import {
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Scissors,
  Users,
  Award
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.getAnalytics();
        setData(res.data || null);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const metrics = data?.metrics || {
    todayAppointments: 0,
    todayRevenue: 0,
    totalRevenue: 0,
    totalCompleted: 0,
    totalCustomers: 0,
    statusBreakdown: { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0, NO_SHOW: 0 }
  };

  const statusTotal = Object.values(metrics.statusBreakdown || {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-editorial text-3xl font-light text-[#181715]">
          Performance & Analytics
        </h2>
        <p className="text-xs text-[#736E67] font-light">
          Key performance indicators, revenue velocity, and treatment volume breakdowns.
        </p>
      </div>

      {/* Primary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Today's Bookings"
          value={metrics.todayAppointments}
          subtitle="Scheduled today"
          icon={Calendar}
          color="champagne"
        />
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(metrics.todayRevenue)}
          subtitle="Collected & confirmed"
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard
          title="Lifetime Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          subtitle="Cumulative salon billing"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Active Clientele"
          value={metrics.totalCustomers}
          subtitle="Registered patrons"
          icon={Users}
          color="charcoal"
        />
      </div>

      {/* Appointment Status Distribution Bar */}
      <div className="bg-white border border-[#ECE7DE] rounded-xs p-6 shadow-xs">
        <h3 className="font-editorial text-xl text-[#181715] font-normal mb-1">
          Appointment Status Distribution
        </h3>
        <p className="text-xs text-[#8C8780] mb-6">
          Lifecycle breakdown of all recorded salon bookings
        </p>

        {/* Stacked visual progress bar */}
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex mb-6">
          <div
            style={{ width: `${(metrics.statusBreakdown.CONFIRMED / statusTotal) * 100}%` }}
            className="bg-emerald-500 transition-all"
            title={`Confirmed: ${metrics.statusBreakdown.CONFIRMED}`}
          />
          <div
            style={{ width: `${(metrics.statusBreakdown.COMPLETED / statusTotal) * 100}%` }}
            className="bg-blue-500 transition-all"
            title={`Completed: ${metrics.statusBreakdown.COMPLETED}`}
          />
          <div
            style={{ width: `${(metrics.statusBreakdown.PENDING / statusTotal) * 100}%` }}
            className="bg-amber-400 transition-all"
            title={`Pending: ${metrics.statusBreakdown.PENDING}`}
          />
          <div
            style={{ width: `${(metrics.statusBreakdown.CANCELLED / statusTotal) * 100}%` }}
            className="bg-red-400 transition-all"
            title={`Cancelled: ${metrics.statusBreakdown.CANCELLED}`}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-emerald-50/60 rounded-xs border border-emerald-100">
            <span className="text-emerald-800 font-semibold block">Confirmed</span>
            <span className="text-xl font-bold font-editorial text-[#181715] mt-1 block">
              {metrics.statusBreakdown.CONFIRMED}
            </span>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xs border border-blue-100">
            <span className="text-blue-800 font-semibold block">Completed</span>
            <span className="text-xl font-bold font-editorial text-[#181715] mt-1 block">
              {metrics.statusBreakdown.COMPLETED}
            </span>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xs border border-amber-100">
            <span className="text-amber-800 font-semibold block">Pending</span>
            <span className="text-xl font-bold font-editorial text-[#181715] mt-1 block">
              {metrics.statusBreakdown.PENDING}
            </span>
          </div>

          <div className="p-3 bg-red-50/60 rounded-xs border border-red-100">
            <span className="text-red-800 font-semibold block">Cancelled</span>
            <span className="text-xl font-bold font-editorial text-[#181715] mt-1 block">
              {metrics.statusBreakdown.CANCELLED}
            </span>
          </div>
        </div>
      </div>

      {/* Top Services & Top Stylists Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Services */}
        <div className="bg-white border border-[#ECE7DE] rounded-xs p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ECE7DE]">
            <div>
              <h3 className="font-editorial text-xl font-normal text-[#181715]">
                Most Booked Services
              </h3>
              <p className="text-xs text-[#8C8780]">Ranked by total patron demand</p>
            </div>
            <Scissors className="w-5 h-5 text-[#C5A880]" />
          </div>

          <div className="space-y-4">
            {data?.popularServices?.map((svc, idx) => (
              <div key={svc.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#181715]">{idx + 1}. {svc.name}</span>
                  <span className="text-[#736E67]">{svc.booking_count} bookings</span>
                </div>
                <div className="h-2 w-full bg-[#F5F2EB] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (svc.booking_count / 10) * 100)}%` }}
                    className="h-full bg-[#C5A880]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Stylists */}
        <div className="bg-white border border-[#ECE7DE] rounded-xs p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ECE7DE]">
            <div>
              <h3 className="font-editorial text-xl font-normal text-[#181715]">
                Artisan Productivity
              </h3>
              <p className="text-xs text-[#8C8780]">Appointments serviced per specialist</p>
            </div>
            <Award className="w-5 h-5 text-[#C5A880]" />
          </div>

          <div className="space-y-4">
            {data?.popularStylists?.map((st) => (
              <div key={st.id} className="flex items-center justify-between text-xs p-3 bg-[#FDFBF7] rounded-xs border border-[#ECE7DE]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#ECE7DE] border border-[#ECE7DE] shrink-0">
                    <img src={st.image_url} alt={st.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#181715] block">{st.name}</span>
                    <span className="text-[10px] text-[#8C8780]">Senior Stylist</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-editorial text-base font-bold text-[#181715]">
                    {st.booking_count}
                  </span>
                  <span className="text-[10px] text-[#8C8780] block">Appointments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
