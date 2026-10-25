// frontend/components/admin/AdminSidebar.jsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  UserCheck,
  Tag,
  CreditCard,
  Image,
  Star,
  BarChart3,
  LogOut,
  ExternalLink,
  Settings
} from 'lucide-react';
import { setAuthToken, setStoredUser } from '@/lib/api';

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setAuthToken(null);
    setStoredUser(null);
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Services', href: '/admin/services', icon: Scissors },
    { name: 'Stylists & Schedule', href: '/admin/stylists', icon: UserCheck },
    { name: 'Offers', href: '/admin/offers', icon: Tag },
    { name: 'Memberships', href: '/admin/memberships', icon: CreditCard },
    { name: 'Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141312] text-[#ECE7DE] border-r border-[#242220] flex flex-col justify-between transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          {/* Logo Brand */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#242220]">
            <Link href="/admin" className="flex flex-col">
              <span className="font-editorial text-xl font-light text-white tracking-[0.16em] uppercase">
                Groom & Glow
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A880] -mt-0.5">
                Staff Management
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xs text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C5A880] text-[#141312] font-semibold shadow-xs'
                      : 'text-[#A6A19A] hover:bg-[#1E1C1A] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#141312]' : 'text-[#8C8780]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Actions */}
        <div className="p-4 border-t border-[#242220] space-y-2 bg-[#11100F]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xs text-xs text-[#8C8780] hover:text-white hover:bg-[#1E1C1A] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Website</span>
            </span>
            <span className="text-[9px] bg-[#242220] px-1.5 py-0.5 rounded text-[#A6A19A]">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xs text-xs text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
