'use client';
import { SearchX } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide
import BookRow, { Book } from './BookRow';

type Props = {
  books: Book[];
  loading: boolean;
  onBorrow: (book: Book) => void;
}; 
 
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-50 animate-pulse">
      <td className="px-4 py-4"><div className="h-3 w-5 bg-slate-100 rounded" /></td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-14 rounded-lg bg-slate-100" />
          <div className="space-y-2">
            <div className="h-3 w-36 bg-slate-100 rounded" />
            <div className="h-2.5 w-24 bg-slate-50 rounded" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4"><div className="h-3 w-10 bg-slate-100 rounded" /></td>
      <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-100 rounded-md" /></td>
      <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-100 rounded-md" /></td>
      <td className="px-4 py-4"><div className="h-8 w-20 bg-slate-100 rounded-lg ml-auto" /></td>
    </tr>
  );
}

export default function BookTable({ books, loading, onBorrow }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['#', 'Book', 'Year', 'Category', 'Status', 'Action'].map((h) => (
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
              [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-[280px] mx-auto">
                    {/* ใช้ SearchX icon แทน Emoji 🔍 */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-2">
                      <SearchX className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">No books found</p>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        We couldnt find any books matching your current search or filters.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              books.map((book, i) => (
                <BookRow key={book.id} book={book} index={i} onBorrow={onBorrow} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 