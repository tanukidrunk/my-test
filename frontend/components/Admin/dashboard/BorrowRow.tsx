'use client';
import { useEffect, useState } from 'react';
import { Borrowed, formatDate } from './borrowedTypes';

type Props = { borrow: Borrowed; index: number };

export default function BorrowRow({ borrow: b, index }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 35);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <tr className={`
      border-b border-slate-100 last:border-0
      transition-all duration-300 ease-out hover:bg-slate-50/80
      ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
    `}>
      {/* Borrow ID */}
      <td className="px-4 py-3.5">
        <span className="text-xs font-bold text-slate-500 tabular-nums">
          #{String(b.id).padStart(4, '0')}
        </span>
      </td>

      {/* Member */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
            {String(b.memberId).slice(-2)}
          </div>
          <span className="text-sm text-slate-700 font-medium">Member {b.memberId}</span>
        </div>
      </td>

      {/* Book */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-base flex-shrink-0">
            📕
          </div>
          <span className="text-sm text-slate-700 font-medium">Book {b.bookId}</span>
        </div>
      </td>

      {/* Loan Date */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-slate-500 tabular-nums">{formatDate(b.loanDate)}</span>
      </td>

      {/* Return Date */}
      <td className="px-4 py-3.5">
        {b.returnDate
          ? <span className="text-sm text-slate-500 tabular-nums">{formatDate(b.returnDate)}</span>
          : <span className="text-slate-300 text-sm">—</span>
        }
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        {b.status === 'BORROWED' ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Borrowed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Returned
          </span>
        )}
      </td>
    </tr>
  );
}