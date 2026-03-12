'use client';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide
import ReturnConfirmModal from './Returnconfirmmodal';

export type Borrowed = {
  id: number;
  memberId: number;
  bookId: number;
  loanDate: string;
  returnDate?: string | null;
  status: 'BORROWED' | 'RETURNED';
  book: { title: string; author: string; publication_year: string };
};
 
export function getDaysLeft(loanDate: string): number {
  const due = new Date(loanDate);
  due.setDate(due.getDate() + 7);
  return Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

type Props = {
  borrow: Borrowed;
  index: number;
  tab: 'active' | 'history';
  returningId: number | null;
  onReturn: (id: number, bookId: number) => void;
};

export default function BorrowRow({ borrow: b, index, tab, returningId, onReturn }: Props) {
  const [visible, setVisible] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 45);
    return () => clearTimeout(t);
  }, [index]);

  const daysLeft = getDaysLeft(b.loanDate);
  const isOverdue = daysLeft < 0;

  const loanDateStr = new Date(b.loanDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const returnDateStr = b.returnDate
    ? new Date(b.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  /* Due date chip */
  const dueChip = isOverdue ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-600 border border-red-100 uppercase tracking-wide">
      <AlertCircle size={12} strokeWidth={2.5} />
      {Math.abs(daysLeft)}d overdue
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wide">
      <CheckCircle2 size={12} strokeWidth={2.5} />
      {daysLeft}d left
    </span>
  );

  /* Status badge */
  const statusBadge = b.status === 'RETURNED' ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Returned
    </span>
  ) : isOverdue ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />Overdue
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Borrowed
    </span>
  );

  const isReturning = returningId === b.id;

  return (
    <>
      <ReturnConfirmModal
        open={confirmOpen}
        bookTitle={b.book.title}
        bookAuthor={b.book.author}
        loading={isReturning}
        onConfirm={() => {
          onReturn(b.id, b.bookId);
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <tr className={`
        border-b border-slate-100 last:border-0
        transition-all duration-300 ease-out hover:bg-slate-50/80
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
      `}>
        {/* # */}
        <td className="px-4 py-3.5 text-xs font-semibold text-slate-400 w-10">
          {String(index + 1).padStart(2, '0')}
        </td>

        {/* Book */}
        <td className="px-4 py-3.5">
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-sm">{b.book.title}</span>
            <span className="text-[11px] font-medium text-slate-400 uppercase mt-0.5">by {b.book.author}</span>
          </div>
        </td>

        {/* Loan date */}
        <td className="px-4 py-3.5 text-sm text-slate-500 tabular-nums font-medium">{loanDateStr}</td>

        {/* Due / Return date */}
        <td className="px-4 py-3.5">
          {tab === 'active' ? dueChip : <span className="text-sm text-slate-500 tabular-nums font-medium">{returnDateStr}</span>}
        </td>

        {/* Status */}
        <td className="px-4 py-3.5">{statusBadge}</td>

        {/* Action */}
        {tab === 'active' && (
          <td className="px-4 py-3.5 text-right">
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={isReturning}
              className="
                inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase
                bg-slate-900 hover:bg-slate-800 text-white
                transition-all duration-150 active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-sm hover:shadow-md
              "
            >
              {isReturning ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Returning…
                </>
              ) : (
                <>
                  <RotateCcw size={14} strokeWidth={2.5} />
                  Return
                </>
              )}
            </button>
          </td>
        )}
      </tr>
    </>
  );
}