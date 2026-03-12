'use client';
import BookCard from '@/components/Member/book/BookCard';
import { Book } from '@/components/Member/book/BookRow';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  loading: boolean;
  onBorrow: (book: Book) => void;
}

export default function BookGrid({ books, loading, onBorrow }: BookGridProps) {
  /* ── skeleton while loading ── */
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 animate-pulse"
          >
            <div className="h-52 bg-slate-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-4/5" />
              <div className="h-3 bg-slate-200 rounded w-3/5" />
              <div className="h-7 bg-slate-200 rounded mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── empty state ── */
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-slate-300" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-600 text-sm">No books found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter</p>
        </div>
      </div>
    );
  }
 
  /* ── grid ── */
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onBorrow={onBorrow} />
      ))}
    </div>
  );
}