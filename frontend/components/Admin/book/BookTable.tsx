'use client';
import { Search, BookX, Library } from 'lucide-react';
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
  getImageUrl: (bookId: number) => Promise<string | null>;
};

export default function BookTable({ books, total, search, categories, onSearchChange, onEdit, onDelete, getImageUrl }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Card header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400">
            <Library size={18} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm tracking-tight">Book Management</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {books.length} of {total} items displayed
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <Search 
            size={14} 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" 
          />
          <input
            type="text"
            placeholder="Search database..."
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['Cover', 'ID', 'Title', 'Author', 'Year', 'Category', 'Actions'].map((h) => (
                <th 
                  key={h} 
                  className={`px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap ${
                    h === 'Actions' ? 'text-right' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {books.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 max-w-[300px] mx-auto">
                    {/* เปลี่ยน 📖 เป็น BookX Icon ในกล่องดีไซน์สะอาดตา */}
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 ring-8 ring-slate-50/50">
                      <BookX size={32} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-900 tracking-tight">No results found</div>
                      <div className="text-sm text-slate-500 leading-relaxed font-medium">
                        Your search didnt match any books in the database. Try adding a new record.
                      </div>
                    </div>
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
                  getImageUrl={getImageUrl}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
             Database Online
           </span>
        </div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          {books.length} Entries
        </span>
      </div>
    </div>
  );
} 