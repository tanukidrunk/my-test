'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Library } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide
import ProtectedLayout from '../../Protected';
import BorrowStats   from '@/components/Member/dashboard/BorrowStats';
import OverdueAlert  from '@/components/Member/dashboard/OverdueAlert';
import BorrowTabs    from '@/components/Member/dashboard/BorrowTabs';
import BorrowTable   from '@/components/Member/dashboard/BorrowTable';
import { Borrowed, getDaysLeft } from '@/components/Member/dashboard/BorrowRow';
import { apiFetch } from '@/app/lib/api/token';

type Tab = 'active' | 'history';

export default function MemberBorrowedPage() {
  const [borrows,     setBorrows]     = useState<Borrowed[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [returningId, setReturningId] = useState<number | null>(null);
  const [tab,         setTab]         = useState<Tab>('active');

  /* ── load ── */
  const loadBorrows = async () => {
    try {
      const json = await apiFetch('/borrow/member', { method: 'GET' });
      setBorrows(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { loadBorrows(); }, []);

  /* ── return ── */
  const handleReturn = async (borrowId: number, bookId: number) => {
    setReturningId(borrowId);
    try {
      const json = await apiFetch(`/borrow/return/${borrowId}`, {
        method: 'PUT',
        body: JSON.stringify({ bookId }),
      });
      setBorrows(Array.isArray(json.data) ? json.data : []);
    } finally {
      setReturningId(null);
    }
  };

  /* ── derived ── */
  const active = borrows.filter((b) => b.status === 'BORROWED');
  const history = borrows.filter((b) => b.status === 'RETURNED');
  const overdue = active.filter((b) => getDaysLeft(b.loanDate) < 0).length;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  
  const displayed = tab === 'active' ? active : history;

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

          {/* ── HEADER ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">
                My personal library
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                Borrowed Books
              </h1>
              <p className="text-slate-500 font-medium">
                Manage your current loans and track your borrowing history
              </p>
            </div>
            
            <Link
              href="/member/book"
              className="
                inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl
                bg-slate-900 text-white text-sm font-bold
                hover:bg-slate-800 transition-all duration-200 
                shadow-lg shadow-slate-200 active:scale-[0.98]
              "
            >
              <Library size={18} strokeWidth={2.5} />
              Browse Catalog
            </Link>
          </div>

          {/* ── STATS ── */}
          <BorrowStats
            active={active.length}
            returned={history.length}
            overdue={overdue}
          />

          <div className="mt-8 space-y-6">
            {/* ── OVERDUE ALERT ── */}
            <OverdueAlert count={overdue} />

            <div className="space-y-4">
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
        </div>
      </div>
    </ProtectedLayout>
  );
}