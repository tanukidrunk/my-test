'use client';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 45);
    return () => clearTimeout(t);
  }, [index]);

  const daysLeft   = getDaysLeft(b.loanDate);
  const isOverdue  = daysLeft < 0;


  const loanDateStr = new Date(b.loanDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });


  const returnDateStr = b.returnDate
    ? new Date(b.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  /* Due date chip */
const dueChip = isOverdue
  ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      ⚠️ {Math.abs(daysLeft)}d overdue
    </span>
  )
  : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
      ✓ {daysLeft}d left
    </span>
  );

  /* Status badge */
  const statusBadge = b.status === 'RETURNED'
    ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Returned
      </span>
    ) : isOverdue ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />Overdue
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Borrowed
      </span>
    );

  return (
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
          <span className="font-semibold text-slate-800 text-sm">{b.book.title}</span>
          <span className="text-xs text-slate-400 mt-0.5">by {b.book.author}</span>
        </div>
      </td>

      {/* Loan date */}
      <td className="px-4 py-3.5 text-sm text-slate-500 tabular-nums">{loanDateStr}</td>

      {/* Due / Return date */}
      <td className="px-4 py-3.5">
        {tab === 'active' ? dueChip : <span className="text-sm text-slate-500 tabular-nums">{returnDateStr}</span>}
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">{statusBadge}</td>

      {/* Action */}
      {tab === 'active' && (
        <td className="px-4 py-3.5">
          <button
            onClick={() => onReturn(b.id, b.bookId)}
            disabled={returningId === b.id}
            className="
              px-4 py-1.5 rounded-lg text-xs font-semibold
              bg-slate-800 hover:bg-slate-700 text-white
              transition-all duration-150 active:scale-95
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-sm
            "
          >
            {returningId === b.id ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Returning…
              </span>
            ) : '↩ Return'}
          </button>
        </td>
      )}
    </tr>
  );
}