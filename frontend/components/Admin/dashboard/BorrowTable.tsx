'use client';

import { useState, Fragment } from 'react';
import { Search, Inbox, CalendarDays, CalendarRange, Calendar } from 'lucide-react';
import BorrowRow from './BorrowRow';
import { Borrowed } from './borrowedTypes';

type Props = {
  records: Borrowed[];
  total: number;
  active: number;
  returned: number;
  search: string;
  onSearchChange: (v: string) => void;
};

export default function BorrowTable({
  records,
  total,
  active,
  returned, 
  search,
  onSearchChange
}: Props) {
  const [view, setView] = useState<'day' | 'month' | 'year'>('day');

  /* ───────── Group records ───────── */
  function groupRecords(records: Borrowed[]) {
    const map: Record<string, Borrowed[]> = {};
    records.forEach((r) => {
      const d = new Date(r.loanDate);
      let key = '';
      if (view === 'day') key = d.toISOString().split('T')[0];
      if (view === 'month') key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (view === 'year') key = `${d.getFullYear()}`;
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }

  const grouped = groupRecords(records);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-white">
        <div>
          <div className="font-bold text-slate-900 text-sm tracking-tight">Borrow Records</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Showing {records.length} of {total} records
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* View mode - shadcn-like toggle group */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/50">
            {(['day', 'month', 'year'] as const).map((v) => {
              const isActive = view === v;
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-200 uppercase tracking-wide
                    ${isActive 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
                  `}
                >
                  {v === 'day' && <CalendarDays size={14} />}
                  {v === 'month' && <CalendarRange size={14} />}
                  {v === 'year' && <Calendar size={14} />}
                  {v === 'day' ? 'Daily' : v === 'month' ? 'Monthly' : 'Yearly'}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative group">
            <Search 
              size={14} 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" 
            />
            <input
              type="text"
              placeholder="Search ID, member, book..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="
                pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50
                text-sm text-slate-700 placeholder:text-slate-400 w-full sm:w-64
                focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400
                transition-all duration-200
              "
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['Borrow ID', 'Member', 'Book', 'Loan Date', 'Return Date', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 max-w-[300px] mx-auto">
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 ring-8 ring-slate-50/50">
                      <Inbox size={32} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-900 tracking-tight">No records found</div>
                      <div className="text-sm text-slate-500 leading-relaxed font-medium">
                        {search ? "Your search didn't match any activity." : "The library's log is currently empty."}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              Object.entries(grouped).map(([date, list]) => (
                <Fragment key={date}>
                  {/* Group header */}
                  <tr className="bg-slate-50/80">
                    <td
                      colSpan={6}
                      className="px-6 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-y border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {date} <span className="text-slate-400 font-medium">({list.length} transactions)</span>
                      </div>
                    </td>
                  </tr>

                  {/* Records */}
                  {list.map((b, i) => (
                    <BorrowRow
                      key={b.id}
                      borrow={b}
                      index={i}
                    />
                  ))}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          {records.length} {records.length === 1 ? 'record' : 'records'} processed
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Active: {active}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Returned: {returned}</span>
          </div>
        </div>
      </div>
    </div>
  );
}