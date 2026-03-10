'use client';
import { Inbox, History } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide
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
    <tr className="border-b border-slate-50 animate-pulse">
      <td className="px-4 py-4"><div className="h-3 w-5 bg-slate-100 rounded" /></td>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="h-3 w-40 bg-slate-100 rounded" />
          <div className="h-2.5 w-28 bg-slate-50 rounded" />
        </div>
      </td>
      <td className="px-4 py-4"><div className="h-3 w-24 bg-slate-100 rounded" /></td>
      <td className="px-4 py-4"><div className="h-5 w-24 bg-slate-100 rounded-md" /></td>
      <td className="px-4 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md" /></td>
      {tab === 'active' && (
        <td className="px-4 py-4 text-right">
          <div className="h-8 w-20 bg-slate-100 rounded-lg ml-auto" />
        </td>
      )}
    </tr>
  );
}

const HEADERS = {
  active:  ['#', 'Book', 'Loan Date', 'Due Date', 'Status', 'Action'],
  history: ['#', 'Book', 'Loan Date', 'Return Date', 'Status'],
};

export default function BorrowTable({ borrows, loading, tab, returningId, onReturn }: Props) {
  const EmptyIcon = tab === 'active' ? Inbox : History;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {HEADERS[tab].map((h) => (
                <th 
                  key={h} 
                  className={`px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest ${
                    h === 'Action' ? 'text-right' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1, 2, 3, 4].map((i) => <SkeletonRow key={i} tab={tab} />)
            ) : borrows.length === 0 ? (
              <tr>
                <td colSpan={tab === 'active' ? 6 : 5} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-[280px] mx-auto">
                    {/* เปลี่ยน Emoji เป็น Lucide Icon ในกล่อง Soft Background */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-2">
                      <EmptyIcon className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 tracking-tight">
                        {tab === 'active' ? 'No active loans' : 'No history yet'}
                      </div>
                      <div className="text-sm text-slate-500 leading-relaxed">
                        {tab === 'active' 
                          ? 'Browse our collection and borrow a book to get started!' 
                          : 'Your returned books and past activities will appear here.'}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              borrows.map((b, i) => (
                <BorrowRow
                  key={b.id}
                  borrow={b}
                  index={i}
                  tab={tab}
                  returningId={returningId}
                  onReturn={onReturn}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}