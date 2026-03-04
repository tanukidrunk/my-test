'use client';
import { Search } from 'lucide-react';
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

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="px-4 py-3.5"><div className="h-3 w-12 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <div className="h-3 w-20 bg-slate-200 rounded" />
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-200" />
          <div className="h-3 w-16 bg-slate-200 rounded" />
        </div>
      </td>
      <td className="px-4 py-3.5"><div className="h-3 w-24 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3.5"><div className="h-3 w-24 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3.5"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
    </tr>
  );
}

export default function BorrowTable({ records, total, active, returned, search, onSearchChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div>
          <div className="font-semibold text-slate-800 text-sm">Borrow Records</div>
          <div className="text-xs text-slate-400 mt-0.5">
            Showing {records.length} of {total} records
          </div>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search ID, member, book…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              pl-8 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50
              text-sm text-slate-700 placeholder:text-slate-400 w-56
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Borrow ID', 'Member', 'Book', 'Loan Date', 'Return Date', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📭</span>
                    <div className="font-semibold text-slate-600">No records found</div>
                    <div className="text-sm text-slate-400">
                      {search ? 'Try a different search term' : 'No borrow records yet'}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((b, i) => <BorrowRow key={b.id} borrow={b} index={i} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-slate-400">{records.length} record{records.length !== 1 ? 's' : ''}</span>
        <span className="text-xs text-slate-400">Active: {active} · Returned: {returned}</span>
      </div>
    </div>
  );
}