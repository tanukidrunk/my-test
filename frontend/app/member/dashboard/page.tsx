'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedLayout from '../../Protected';

import BorrowStats   from '@/components/Member/dashboard/BorrowStats';
import OverdueAlert  from '@/components/Member/dashboard/OverdueAlert';
import BorrowTabs    from '@/components/Member/dashboard/BorrowTabs';
import BorrowTable   from '@/components/Member/dashboard/BorrowTable';
import { Borrowed, getDaysLeft } from '@/components/Member/dashboard/BorrowRow';

type Tab = 'active' | 'history';

export default function MemberBorrowedPage() {
  const [borrows,     setBorrows]     = useState<Borrowed[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [returningId, setReturningId] = useState<number | null>(null);
  const [tab,         setTab]         = useState<Tab>('active');

  /* ── load ── */
  const loadBorrows = async () => {
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API}/borrow/member`, { credentials: 'include' });
      if (!res.ok) { setBorrows([]); return; }
      const json = await res.json();
      setBorrows(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadBorrows(); }, []);

  /* ── return ── */
  const handleReturn = async (borrowId: number, bookId: number) => {
    setReturningId(borrowId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/borrow/return/${borrowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookId }),
      });
      if (!res.ok) return;
      const json = await res.json();
      setBorrows(Array.isArray(json.data) ? json.data : []);
    } finally {
      setReturningId(null);
    }
  };

  /* ── derived ── */
  const active   = borrows.filter((b) => b.status === 'BORROWED');
  const history  = borrows.filter((b) => b.status === 'RETURNED');
  const overdue  = active.filter((b) => getDaysLeft(b.loanDate) < 0).length;
  const dueSoon  = active.filter((b) => { const d = getDaysLeft(b.loanDate); return d >= 0 && d <= 3; }).length;
  const displayed = tab === 'active' ? active : history;

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* ── HEADER ── */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">My Library</div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Borrowed Books</h1>
              <p className="text-slate-400 text-sm">Manage your current loans and borrowing history</p>
            </div>
            <Link
              href="/member/book"
              className="
                flex-shrink-0 mt-1 flex items-center gap-2 px-4 py-2 rounded-xl
                border border-slate-200 bg-white text-sm font-medium text-slate-600
                hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-sm
              "
            >
              <span>📚</span> Browse Books
            </Link>
          </div>

          {/* ── STATS ── */}
          <BorrowStats
            active={active.length}
            returned={history.length}
            dueSoon={dueSoon}
            overdue={overdue}
          />

          {/* ── OVERDUE ALERT ── */}
          <OverdueAlert count={overdue} />

          {/* ── TABS ── */}
          <BorrowTabs
            active={tab}
            onChange={setTab}
            activeCount={active.length}
            historyCount={history.length}
          />

          {/* ── TABLE ── */}
          <BorrowTable
            borrows={displayed}
            loading={loading}
            tab={tab}
            returningId={returningId}
            onReturn={handleReturn}
          />
        </div>
      </div>
    </ProtectedLayout>
  );
}