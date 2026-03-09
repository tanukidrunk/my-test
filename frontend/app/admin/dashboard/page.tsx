'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { apiFetch } from '@/app/lib/api/token';
import DashboardStats from '@/components/Admin/dashboard/DashboardStats';
import BorrowTable    from '@/components/Admin/dashboard/BorrowTable';
import { Borrowed }   from '@/components/Admin/dashboard/borrowedTypes';
 
export default function AdminDashboard() {
  const [borrowed,   setBorrowed]   = useState<Borrowed[]>([]); 
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [spinning,   setSpinning]   = useState(false);
  const [search,     setSearch]     = useState('');
  const router = useRouter();

  /* ── Load ── */
  const loadBorrowed = async (silent = false) => {
    if (!silent) setLoading(true);
    else { setRefreshing(true); setSpinning(true); }
    try {
    const json = await apiFetch('/borrow');
    setBorrowed(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      setBorrowed([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setTimeout(() => setSpinning(false), 600);
    }
  };

  /* ── Auth check ── */
useEffect(() => {
  const checkAuth = async () => {
    try {
      const json = await apiFetch('/auth/me');
      const member = json.data?.member;

      if (!member || member.role !== 'ADMIN') {
        router.replace('/login');
        return;
      }

      loadBorrowed();
    } catch (err) {
      router.replace('/login');
    }
  };

  checkAuth();
}, []);

  /* ── Derived ── */
  const total    = borrowed.length;
  const active   = borrowed.filter((b) => b.status === 'BORROWED').length;
  const returned = borrowed.filter((b) => b.status === 'RETURNED').length;

  const filtered = borrowed.filter((b) => {
    const q = search.toLowerCase();
    return (
      String(b.id).includes(q)       ||
      String(b.memberId).includes(q) ||
      String(b.bookId).includes(q)   ||
      b.status.toLowerCase().includes(q)
    );
  });

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="w-8 h-8 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── TOP BAR ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Admin Panel</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Borrowed Dashboard</h1>
            <p className="text-slate-400 text-sm">Monitor all borrow records in real-time</p>
          </div>
          <button
            onClick={() => loadBorrowed(true)}
            disabled={refreshing}
            className="
              flex-shrink-0 mt-1 flex items-center gap-2 px-4 py-2 rounded-xl
              border border-slate-200 bg-white text-sm font-medium text-slate-600
              hover:bg-slate-50 hover:border-slate-300
              transition-all duration-150 active:scale-95 shadow-sm
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            <RefreshCw size={14} className={spinning ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* ── STATS ── */}
        <DashboardStats borrowed={borrowed} />

        {/* ── TABLE ── */}
        <BorrowTable
          records={filtered}
          total={total}
          active={active}
          returned={returned}
          search={search}
          onSearchChange={setSearch}
        />
      </div>
    </div>
  );
}