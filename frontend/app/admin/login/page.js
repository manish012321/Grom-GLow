// frontend/app/admin/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setAuthToken, setStoredUser } from '@/lib/api';
import { Lock, Mail, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@groomandglow.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await api.login({ email, password });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
        setStoredUser(res.data.user);
        router.push('/admin');
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#11100F] text-[#FDFBF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-editorial text-3xl tracking-[0.2em] font-light text-[#FDFBF7] uppercase block">
              Groom & Glow
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] block mt-0.5">
              Staff Portal & Atelier Operations
            </span>
          </Link>
        </div>

        <div className="bg-[#181715] border border-[#2A2825] rounded-xs p-8 shadow-2xl">
          <div className="mb-6 pb-4 border-b border-[#2A2825] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#FDFBF7]">
                Salon Director Access
              </h2>
              <p className="text-xs text-[#8C8780] mt-0.5">
                Enter your administrative credentials to continue.
              </p>
            </div>
            <ShieldCheck className="w-6 h-6 text-[#C5A880]" />
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[#A6A19A] mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#736E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@groomandglow.com"
                  className="w-full bg-[#11100F] border border-[#2A2825] rounded-xs pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[#A6A19A] mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#736E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#11100F] border border-[#2A2825] rounded-xs pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#C5A880] text-[#141312] font-semibold text-xs uppercase tracking-widest rounded-xs hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Access...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Atelier Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Development default hint */}
          <div className="mt-6 pt-4 border-t border-[#242220] text-center">
            <span className="text-[10px] text-[#736E67] block">
              Default Credentials (Seeded):
            </span>
            <code className="text-[11px] text-[#C5A880] font-mono mt-1 block">
              admin@groomandglow.com / admin123
            </code>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[#8C8780] hover:text-[#C5A880] transition-colors"
          >
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
