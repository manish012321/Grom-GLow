// frontend/app/admin/customers/page.js
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { Search, User, Phone, Mail, Calendar, IndianRupee, ArrowUpDown, X, Clock } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('total_spent');

  // Customer History Drawer / Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.getCustomers({ search, sortBy, order: 'DESC' });
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleSelectCustomer = async (cust) => {
    setSelectedCustomer(cust);
    try {
      setLoadingDetails(true);
      const res = await api.getCustomerById(cust.id);
      setCustomerDetails(res.data);
    } catch (err) {
      alert('Failed to load customer profile');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-3xl font-light text-[#181715]">
            Customer CRM
          </h2>
          <p className="text-xs text-[#736E67] font-light">
            Patron profiles, total lifetime visit counts, cumulative spend, and appointment logs.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#8C8780]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-[#ECE7DE] rounded-xs text-xs bg-white text-[#181715]"
          >
            <option value="total_spent">Highest Spend</option>
            <option value="total_visits">Most Visits</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#ECE7DE] rounded-xs p-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#8C8780] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#ECE7DE] rounded-xs text-xs focus:outline-none focus:border-[#181715]"
          />
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#ECE7DE] rounded-xs shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-[#8C8780]">
            Loading Client CRM...
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] border-b border-[#ECE7DE] text-[#8C8780] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Customer Name</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Total Visits</th>
                  <th className="px-5 py-3.5">Cumulative Spend</th>
                  <th className="px-5 py-3.5">Notes</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DE]">
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleSelectCustomer(c)}
                    className="hover:bg-[#FDFBF7] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#181715] font-editorial text-base">
                        {c.name}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[#181715] font-medium">{c.phone}</div>
                      {c.email && (
                        <div className="text-[11px] text-[#8C8780]">{c.email}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#F5F2EB] text-[#181715] font-semibold text-[11px]">
                        {c.total_visits} visits
                      </span>
                    </td>
                    <td className="px-5 py-4 font-editorial text-sm font-bold text-emerald-700">
                      {formatCurrency(c.total_spent)}
                    </td>
                    <td className="px-5 py-4 text-[#736E67] max-w-xs truncate">
                      {c.notes || '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCustomer(c);
                        }}
                        className="text-xs text-[#C5A880] font-semibold hover:underline"
                      >
                        View History →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-xs text-[#8C8780]">
            No customers found.
          </div>
        )}
      </div>

      {/* CUSTOMER DETAIL / APPOINTMENT HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#ECE7DE] rounded-xs max-w-xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-6 right-6 text-[#8C8780] hover:text-[#181715]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
              Patron Dossier
            </span>
            <h3 className="font-editorial text-3xl font-light text-[#181715] mt-1">
              {selectedCustomer.name}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-4 p-4 bg-[#FDFBF7] border border-[#ECE7DE] rounded-xs text-xs">
              <div>
                <span className="text-[#8C8780] block text-[10px] uppercase tracking-wider">Total Visits</span>
                <span className="text-xl font-bold font-editorial text-[#181715] mt-0.5 block">
                  {selectedCustomer.total_visits}
                </span>
              </div>
              <div>
                <span className="text-[#8C8780] block text-[10px] uppercase tracking-wider">Lifetime Spend</span>
                <span className="text-xl font-bold font-editorial text-emerald-700 mt-0.5 block">
                  {formatCurrency(selectedCustomer.total_spent)}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-[#ECE7DE]">
                <span className="text-[#8C8780] block text-[10px] uppercase tracking-wider">Contact</span>
                <span className="text-[#181715] block mt-0.5">{selectedCustomer.phone} • {selectedCustomer.email || 'No email on record'}</span>
              </div>
            </div>

            {/* Appointment History */}
            <div className="mt-6">
              <h4 className="font-editorial text-xl font-normal text-[#181715] mb-3">
                Appointment History
              </h4>

              {loadingDetails ? (
                <div className="py-8 text-center text-xs text-[#8C8780]">
                  Loading Visit History...
                </div>
              ) : customerDetails?.appointments?.length > 0 ? (
                <div className="space-y-2">
                  {customerDetails.appointments.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 border border-[#ECE7DE] rounded-xs bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-[#181715]">
                          {app.service_name}
                        </div>
                        <div className="text-[11px] text-[#8C8780]">
                          with {app.stylist_name} • {formatDate(app.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold border bg-gray-50 border-gray-200">
                          {app.status}
                        </span>
                        <div className="text-[11px] font-semibold text-[#181715] mt-0.5">
                          {formatCurrency(app.service_price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[#8C8780] border border-dashed border-[#ECE7DE]">
                  No prior appointment history recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
