'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid passcode');
      }

      // Hard redirect so the browser immediately attaches the new cookie
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4 mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-center text-slate-900 mb-1">Admin Access</h2>
          <p className="text-xs text-center text-slate-500 mb-6">Enter your console passcode to manage inventory.</p>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg transition shadow disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Unlock Console'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}