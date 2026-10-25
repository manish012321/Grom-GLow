// frontend/app/admin/layout.js
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getAuthToken } from '@/lib/api';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If on login page, skip auth check
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      router.push('/admin/login');
    } else {
      setCheckingAuth(false);
    }
  }, [pathname, router]);

  // If on login page, render child directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#181715] border-t-[#C5A880] rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs uppercase tracking-widest text-[#8C8780]">
            Authorizing Staff Access...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#181715]">
      {/* Desktop Fixed Sidebar & Mobile Drawer */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Atelier Operations"
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
