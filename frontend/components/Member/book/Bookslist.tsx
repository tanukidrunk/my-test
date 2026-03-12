'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, BookOpen, BookMarked, Library,
  Search, SlidersHorizontal, Star, Clock,
  CheckCircle2, XCircle, ShoppingBag, Sparkles
} from 'lucide-react';
import ProtectedLayout from '@/app/Protected';
import { Book } from '@/components/Member/book/BookRow';
import { apiFetch } from '@/app/lib/api/token';

import { Badge }   from '@/components/ui/badge';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
 
type FilterType = 'ALL' | 'AVAILABLE' | 'BORROWED';

/* ─────────────────────────────────────────────
   Cover colour palette – deterministic per title
───────────────────────────────────────────── */
const COVER_PALETTES = [
  { bg: 'from-violet-600 to-indigo-800',  accent: 'bg-violet-400' },
  { bg: 'from-rose-500   to-pink-800',    accent: 'bg-rose-300'   },
  { bg: 'from-amber-500  to-orange-700',  accent: 'bg-amber-300'  },
  { bg: 'from-emerald-500 to-teal-800',   accent: 'bg-emerald-300'},
  { bg: 'from-sky-500    to-blue-800',    accent: 'bg-sky-300'    },
  { bg: 'from-fuchsia-500 to-purple-800', accent: 'bg-fuchsia-300'},
  { bg: 'from-lime-500   to-green-800',   accent: 'bg-lime-300'   },
  { bg: 'from-cyan-500   to-cyan-800',    accent: 'bg-cyan-300'   },
];
function getPalette(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return COVER_PALETTES[Math.abs(hash) % COVER_PALETTES.length];
}

/* ─────────────────────────────────────────────
   Book Cover component
───────────────────────────────────────────── */
function BookCover({ book }: { book: Book }) {
  const { bg, accent } = getPalette(book.title);
  const initials = book.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className={`relative w-full aspect-[2/3] rounded-t-md bg-gradient-to-br ${bg} overflow-hidden flex flex-col`}>
      {/* decorative lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/3 w-px h-full bg-white" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-white" />
      </div>
      {/* spine strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${accent} opacity-60`} />
      {/* content */}
      <div className="flex flex-col flex-1 justify-between p-4 pl-5">
        <div>
          {book.category?.name && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">
              {book.category.name}
            </span>
          )}
          <p className="mt-2 text-white font-bold text-sm leading-tight line-clamp-3">
            {book.title}
          </p>
        </div>
        <div className="text-[28px] font-black text-white/20 select-none text-right pr-1">
          {initials}
        </div>
      </div>
      <div className="px-4 pl-5 pb-3">
        <p className="text-white/70 text-[10px] font-medium truncate">{book.author}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Skeleton Card
───────────────────────────────────────────── */
function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full aspect-[2/3] rounded-md" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-full mt-1" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Book Card
───────────────────────────────────────────── */
function BookCard({ book, onBorrow }: { book: Book; onBorrow: (b: Book) => void }) {
  const isAvailable = book.status === 'AVAILABLE';
  return (
    <Card className="group flex flex-col overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white p-0 gap-0">
      {/* Cover */}
      <div className="relative overflow-hidden">
        <BookCover book={book} />
        {/* status badge overlay */}
        <div className="absolute top-2 right-2">
          {isAvailable ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 gap-1 shadow-md">
              <CheckCircle2 size={8} /> Available
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-slate-800/80 text-slate-200 text-[9px] px-1.5 py-0.5 gap-1 shadow-md backdrop-blur-sm">
              <Clock size={8} /> Borrowed
            </Badge>
          )}
        </div>
      </div>

      {/* Body */}
      <CardContent className="flex flex-col gap-1 px-3 pt-3 pb-1 flex-1">
        <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {book.title}
        </p>
        <p className="text-slate-500 text-xs truncate">{book.author}</p>
        {book.category?.name && (
          <Badge variant="outline" className="w-fit text-[9px] px-1.5 py-0 mt-0.5 text-slate-500 border-slate-200">
            {book.category.name}
          </Badge>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-3 pb-3 pt-2">
        <Button
          size="sm"
          className={`w-full text-xs font-bold h-8 gap-1.5 transition-all duration-200 ${
            isAvailable
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100'
          }`}
          disabled={!isAvailable}
          onClick={() => isAvailable && onBorrow(book)}
        >
          {isAvailable ? (
            <><BookMarked size={12} /> Borrow Now</>
          ) : (
            <><XCircle size={12} /> Unavailable</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Stats Bar
───────────────────────────────────────────── */
function StatsBar({ total, available, borrowed }: { total: number; available: number; borrowed: number }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Total Books',  value: total,     icon: Library,    color: 'text-slate-700',   bg: 'bg-slate-100'   },
        { label: 'Available',    value: available,  icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50'  },
        { label: 'Borrowed',     value: borrowed,   icon: Clock,      color: 'text-amber-700',  bg: 'bg-amber-50'    },
      ].map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className={`rounded-xl ${bg} border border-slate-100 px-4 py-3 flex items-center gap-3`}>
          <div className={`${color} opacity-80`}><Icon size={18} /></div>
          <div>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 font-medium">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function BooksListPage() {
  const [books,        setBooks]        = useState<Book[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [confirming,   setConfirming]   = useState(false);
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const router = useRouter();

  /* auth check */
  useEffect(() => {
    apiFetch('/auth/me').catch(() => router.push('/login'));
  }, [router]);

  /* load books */
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

  /* borrow */
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

  /* derived */
  const totalBooks     = books.length;
  const availableCount = books.filter(b => b.status === 'AVAILABLE').length;
  const borrowedCount  = books.filter(b => b.status === 'BORROWED').length;

  const filtered = books.filter(book => {
    const q = search.toLowerCase();
    const matchSearch =
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.category?.name?.toLowerCase().includes(q);
    const matchFilter = activeFilter === 'ALL' || book.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-[#f8f8fc] font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

          {/* ── HEADER ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-indigo-600 rounded-lg">
                  <BookOpen size={16} className="text-white" />
                </div>
                <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                  Library Catalog
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Book Store
              </h1>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                Discover & borrow your next favorite read
              </p>
            </div>
            <Link
              href="/member/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98]"
            >
              <ArrowLeft size={15} strokeWidth={2.5} />
              Back to Dashboard
            </Link>
          </div>

          {/* ── STATS ── */}
          <div className="mb-6">
            <StatsBar total={totalBooks} available={availableCount} borrowed={borrowedCount} />
          </div>

          <Separator className="mb-6" />

          {/* ── TOOLBAR ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by title, author, or category…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-white border-slate-200 text-sm h-10"
              />
            </div>
            <Select
              value={activeFilter}
              onValueChange={v => setActiveFilter(v as FilterType)}
            >
              <SelectTrigger className="w-full sm:w-44 bg-white border-slate-200 text-sm h-10 gap-2">
                <SlidersHorizontal size={14} className="text-slate-400" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Books</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="BORROWED">Borrowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ── RESULT COUNT ── */}
          {!loading && (
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Showing <span className="font-black text-slate-700">{filtered.length}</span> of {totalBooks} books
              {search && <> matching <span className="italic">{search}</span></>}
            </p>
          )}

          {/* ── GRID ── */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, i) => <BookCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-lg font-bold">No books found</p>
              <p className="text-sm">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filtered.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBorrow={b => { setSelectedBook(b); setConfirmOpen(true); }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CONFIRM DIALOG ── */}
      <Dialog open={confirmOpen} onOpenChange={open => { if (!open) { setConfirmOpen(false); setSelectedBook(null); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <BookMarked size={18} className="text-indigo-600" />
              Confirm Borrow
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              You are about to borrow this book. Please confirm.
            </DialogDescription>
          </DialogHeader>

          {selectedBook && (
            <div className="flex gap-4 py-2">
              <div className="w-16 shrink-0">
                <BookCover book={selectedBook} />
              </div>
              <div className="flex flex-col gap-1 justify-center">
                <p className="font-bold text-slate-900 text-sm leading-snug">{selectedBook.title}</p>
                <p className="text-xs text-slate-500">{selectedBook.author}</p>
                {selectedBook.category?.name && (
                  <Badge variant="outline" className="w-fit text-[9px] px-1.5 py-0 text-slate-500">
                    {selectedBook.category.name}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setConfirmOpen(false); setSelectedBook(null); }}
              disabled={confirming}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={confirmBorrow}
              disabled={confirming}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              {confirming ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Borrowing…
                </span>
              ) : (
                <><BookMarked size={13} /> Confirm Borrow</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedLayout>
  );
}