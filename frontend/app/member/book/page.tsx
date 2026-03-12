'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProtectedLayout   from '../../Protected';
import BookStats         from '@/components/Member/book/BookStats';
import BookToolbar       from '@/components/Member/book/BookToolbar';
import BookGrid          from '@/components/Member/book/BookGrid';        // ← replaced BookTable
import BorrowConfirmModal from '@/components/Member/book/BorrowConfirmModal';
import { Book }          from '@/components/Member/book/BookRow';
import { apiFetch }      from '@/app/lib/api/token';

type FilterType = 'ALL' | 'AVAILABLE' | 'BORROWED';
 
export default function BooksListPage() {
  const [books,        setBooks]       = useState<Book[]>([]);
  const [loading,      setLoading]     = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [confirming,   setConfirming]   = useState(false);
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const router = useRouter();

  /* ── auth check ── */
  useEffect(() => { 
    const checkAuth = async () => {
      try {
        await apiFetch('/auth/me');
      } catch {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  /* ── load books ── */
  const loadBooks = async () => {
    try {
      const json = await apiFetch('/book');
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
      await apiFetch('/borrow/borrowed', {
        method: 'POST',
        body: JSON.stringify({ bookId: selectedBook.id }),
      });
      await loadBooks();
    } catch (err) {
      console.error(err);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          {/* ── PAGE HEADER ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">
                Library Catalog
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                Browse Books
              </h1>
              <p className="text-slate-500 font-medium">
                Explore our collection and borrow your next favorite read
              </p>
            </div>

            <Link
              href="/member/dashboard"
              className="
                inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                border border-slate-200 bg-white text-sm font-bold text-slate-600
                hover:bg-slate-50 hover:border-slate-300 transition-all duration-200
                shadow-sm active:scale-[0.98]
              "
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back to Dashboard
            </Link>
          </div>

          {/* ── STATS ── */}
          <div className="mb-8">
            <BookStats total={totalBooks} available={availableCount} borrowed={borrowedCount} />
          </div>

          {/* ── TOOLBAR ── */}
          <div className="mb-6">
            <BookToolbar
              search={search}
              onSearchChange={setSearch}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* ── BOOK GRID ── */}
          <BookGrid
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