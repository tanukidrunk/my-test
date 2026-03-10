'use client';
import { useEffect, useState } from 'react';
import { Book as BookIcon, Plus } from 'lucide-react'; // นำเข้าไอคอน

type Category = { id: number; name: string };
type Borrow = { id: number; memberId: number; bookId: number; loanDate: string; status: 'BORROWED' | 'RETURNED' };

export type Book = {
  id: number;
  title: string;
  author: string;
  publication_year: string;
  status: 'AVAILABLE' | 'BORROWED';
  imageUrl?: string | null;
  category: Category;
  borrows: Borrow[];
};
 
type Props = {
  book: Book;
  index: number;
  onBorrow: (book: Book) => void;
};

export default function BookRow({ book, index, onBorrow }: Props) {
  const [visible, setVisible] = useState(false);
  const isBorrowed = book.status === 'BORROWED';

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 40);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <tr
      className={`
        border-b border-slate-100 last:border-0
        transition-all duration-300 ease-out
        hover:bg-slate-50/80
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
      `}
    >
      {/* # */}
      <td className="px-4 py-3.5 text-xs font-semibold text-slate-400 w-10">
        {String(index + 1).padStart(2, '0')}
      </td>

      {/* Book info */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm border border-slate-200">
            {book.imageUrl ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API}${book.imageUrl}`}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                {/* ใช้ BookIcon แทน Emoji 📖 */}
                <BookIcon size={20} strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{book.title}</div>
            <div className="text-xs text-slate-400 mt-0.5">by {book.author}</div>
          </div>
        </div>
      </td>

      {/* Year */}
      <td className="px-4 py-3.5 text-sm text-slate-500 tabular-nums">{book.publication_year}</td>

      {/* Category */}
      <td className="px-4 py-3.5">
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          {book.category?.name || '—'}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        {isBorrowed ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Borrowed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        )}
      </td>

      {/* Action */}
      <td className="px-4 py-3.5 text-right">
        {!isBorrowed && (
          <button
            onClick={() => onBorrow(book)}
            className="
              inline-flex items-center gap-1.5
              px-3 py-1.5 rounded-lg text-xs font-semibold
              bg-slate-900 hover:bg-slate-800 text-white
              transition-all duration-150 active:scale-95
              shadow-sm hover:shadow-md
            "
          >
            {/* ใช้ Plus icon แทนเครื่องหมาย + */}
            <Plus size={14} strokeWidth={3} />
            Borrow
          </button>
        )}
      </td>
    </tr>
  );
}