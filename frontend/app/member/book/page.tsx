'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedLayout from '../../protected';

import BookStats          from '@/components/Member/book/BookStats';
import BookToolbar        from '@/components/Member/book/BookToolbar';
import BookTable          from '@/components/Member/book/BookTable';
import BorrowConfirmModal from '@/components/Member/book/BorrowConfirmModal';
import { Book }           from '@/components/Member/book/BookRow';

type FilterType = 'ALL' | 'AVAILABLE' | 'BORROWED';

export default function BooksListPage() {
  const [books,       setBooks]       = useState<Book[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [confirming,   setConfirming]   = useState(false);
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  /* ── auth check ── */
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, { credentials: 'include' });
  }, []);

  /* ── load books ── */
  const loadBooks = async () => {
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API}/book`);
      const json = await res.json();
      setBooks(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadBooks(); }, []);

  /* ── borrow ── */
  const confirmBorrow = async () => {
    if (!selectedBook) return;
    setConfirming(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/borrow/borrowed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookId: selectedBook.id }),
      });
      if (res.ok) {
        setBooks((prev) =>
          prev.map((b) => b.id === selectedBook.id ? { ...b, status: 'BORROWED' } : b),
        );
      }
    } finally {
      setConfirming(false);
      setConfirmOpen(false);
      setSelectedBook(null);
    }
  };

  /* ── derived ── */
  const totalBooks     = books.length;
  const availableCount = books.filter((b) => b.status === 'AVAILABLE').length;
  const borrowedCount  = books.filter((b) => b.status === 'BORROWED').length;

  const filtered = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category?.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'ALL' || book.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* ── PAGE HEADER ── */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">
                Library Catalog
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Browse Books</h1>
              <p className="text-slate-400 text-sm">Explore our collection and borrow a book today</p>
            </div>
            <Link
              href="/member/dashboard"
              className="
                flex-shrink-0 mt-1 px-4 py-2 rounded-xl border border-slate-200 bg-white
                text-sm font-medium text-slate-600
                hover:bg-slate-50 hover:border-slate-300
                transition-all duration-150 shadow-sm
              "
            >
              ← My Dashboard
            </Link>
          </div>

          {/* ── STATS ── */}
          <BookStats total={totalBooks} available={availableCount} borrowed={borrowedCount} />

          {/* ── TOOLBAR ── */}
          <BookToolbar
            search={search}
            onSearchChange={setSearch}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* ── TABLE ── */}
          <BookTable
            books={filtered}
            loading={loading}
            onBorrow={(book) => { setSelectedBook(book); setConfirmOpen(true); }}
          />
        </div>
      </div>

      {/* ── CONFIRM MODAL ── */}
      <BorrowConfirmModal
        book={selectedBook}
        open={confirmOpen}
        confirming={confirming}
        onConfirm={confirmBorrow}
        onCancel={() => { setConfirmOpen(false); setSelectedBook(null); }}
      />
    </ProtectedLayout>
  );
}