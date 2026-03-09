'use client';
import BorrowRow, { Borrowed } from './BorrowRow';

type Tab = 'active' | 'history';

type Props = {
  borrows: Borrowed[];
  loading: boolean;
  tab: Tab;
  returningId: number | null;
  onReturn: (id: number, bookId: number) => void;
};

function SkeletonRow({ tab }: { tab: Tab }) {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="px-4 py-3.5"><div className="h-3 w-5 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3.5">
        <div className="space-y-2">
          <div className="h-3 w-40 bg-slate-200 rounded" />
          <div className="h-2.5 w-28 bg-slate-100 rounded" />
        </div>
      </td>
      <td className="px-4 py-3.5"><div className="h-3 w-24 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3.5"><div className="h-5 w-24 bg-slate-200 rounded-full" /></td>
      <td className="px-4 py-3.5"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
      {tab === 'active' && <td className="px-4 py-3.5"><div className="h-7 w-20 bg-slate-200 rounded-lg" /></td>}
    </tr>
  );
}

const HEADERS = {
  active:  ['#', 'Book', 'Loan Date', 'Due Date', 'Status', 'Action'],
  history: ['#', 'Book', 'Loan Date', 'Return Date', 'Status'],
};

export default function BorrowTable({ borrows, loading, tab, returningId, onReturn }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {HEADERS[tab].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && [1, 2, 3].map((i) => <SkeletonRow key={i} tab={tab} />)}

            {!loading && borrows.length === 0 && (
              <tr>
                <td colSpan={tab === 'active' ? 6 : 5} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">{tab === 'active' ? '📭' : '📋'}</span>
                    <div className="font-semibold text-slate-600">
                      {tab === 'active' ? 'No active loans' : 'No borrowing history yet'}
                    </div>
                    <div className="text-sm text-slate-400">
                      {tab === 'active' ? 'Browse our collection and borrow a book!' : 'Your returned books will appear here.'}
                    </div>
                  </div>
                </td>
              </tr>
            )} 

            {!loading && borrows.map((b, i) => (
              <BorrowRow
                key={b.id}
                borrow={b}
                index={i}
                tab={tab}
                returningId={returningId}
                onReturn={onReturn}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 