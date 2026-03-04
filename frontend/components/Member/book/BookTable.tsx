'use client';
import BookRow, { Book } from './BookRow';

type Props = {
  books: Book[];
  loading: boolean;
  onBorrow: (book: Book) => void;
};

function SkeletonRow({ i }: { i: number }) {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="px-4 py-3.5"><div className="h-3 w-5 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-14 rounded-lg bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3 w-36 bg-slate-200 rounded" />
            <div className="h-2.5 w-24 bg-slate-100 rounded" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5"><div className="h-3 w-10 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3.5"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
      <td className="px-4 py-3.5"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
      <td className="px-4 py-3.5"><div className="h-7 w-16 bg-slate-200 rounded-lg mx-auto" /></td>
    </tr>
  );
}

export default function BookTable({ books, loading, onBorrow }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['#', 'Book', 'Year', 'Category', 'Status', 'Action'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && [1, 2, 3, 4].map((i) => <SkeletonRow key={i} i={i} />)}

            {!loading && books.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">🔍</span>
                    <div className="font-semibold text-slate-600">No books found</div>
                    <div className="text-sm text-slate-400">Try adjusting your search or filter</div>
                  </div>
                </td>
              </tr>
            )}

            {!loading && books.map((book, i) => (
              <BookRow key={book.id} book={book} index={i} onBorrow={onBorrow} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}