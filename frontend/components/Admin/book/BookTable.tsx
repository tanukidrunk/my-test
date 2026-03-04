'use client';
import { Search } from 'lucide-react';
import BookRow from './BookRow';
import { Book, Category } from './bookTypes';

type Props = {
  books: Book[];
  total: number;
  search: string;
  categories: Category[];
  onSearchChange: (v: string) => void;
  onEdit: (b: Book) => void;
  onDelete: (id: number) => void;
};

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="px-4 py-3"><div className="w-9 h-12 rounded-lg bg-slate-200" /></td>
      <td className="px-4 py-3"><div className="h-3 w-8 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-36 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-24 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3"><div className="h-5 w-16 bg-slate-200 rounded-full" /></td>
      <td className="px-4 py-3"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-7 w-14 bg-slate-200 rounded-lg" />
          <div className="h-7 w-16 bg-slate-200 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

export default function BookTable({ books, total, search, categories, onSearchChange, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div>
          <div className="font-semibold text-slate-800 text-sm">Book List</div>
          <div className="text-xs text-slate-400 mt-0.5">{books.length} of {total} books</div>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search title or author…"
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
              {['Cover', 'ID', 'Title', 'Author', 'Year', 'Category', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📖</span>
                    <div className="font-semibold text-slate-600">No books found</div>
                    <div className="text-sm text-slate-400">Add your first book using the form above</div>
                  </div>
                </td>
              </tr>
            ) : (
              books.map((b, i) => (
                <BookRow
                  key={b.id}
                  book={b}
                  index={i}
                  categories={categories}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-slate-400">Showing {books.length} books</span>
        <span className="text-xs text-slate-400">Last updated just now</span>
      </div>
    </div>
  );
}