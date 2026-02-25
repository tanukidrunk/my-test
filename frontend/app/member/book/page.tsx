'use client';
import { useEffect, useState } from 'react';
import ProtectedLayout from '../../Protected';
import Link from 'next/link';
import styles from './book.module.css';

type Category = {
  id: number;
  name: string;
};

type Borrow = {
  id: number;
  memberId: number;
  bookId: number;
  loanDate: string;
  status: 'BORROWED' | 'RETURNED';
};

type Book = {
  id: number;
  title: string;
  author: string;
  publication_year: string;
  status: 'AVAILABLE' | 'BORROWED';
  imageUrl?: string | null;
  category: Category;
  borrows: Borrow[];
};

export default function BooksListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'AVAILABLE' | 'BORROWED'>('ALL');

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
    loadUser();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/book`);
      const json = await res.json();
      setBooks(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmBorrow = async () => {
    if (!selectedBook) return;
    setConfirming(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/borrow/borrowed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: selectedBook.id }),
      });
      if (res.ok) {
        setBooks((prev) =>
          prev.map((b) =>
            b.id === selectedBook.id ? { ...b, status: 'BORROWED' } : b,
          ),
        );
      }
    } finally {
      setConfirming(false);
      setConfirmOpen(false);
      setSelectedBook(null);
    }
  };

  useEffect(() => { loadBooks(); }, []);

  const totalBooks     = books.length;
  const availableCount = books.filter((b) => b.status === 'AVAILABLE').length;
  const borrowedCount  = books.filter((b) => b.status === 'BORROWED').length;

  const filters = ['ALL', 'AVAILABLE', 'BORROWED'] as const;

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
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className={styles.pageRoot}>
        {/* ── PAGE HEADER ── */}
        <div className={styles.pageHeader}>
          <div className={styles.pageTitleWrap}>
            <div className={styles.pageEyebrow}>Library Catalog</div>
            <h1 className={styles.pageTitle}>Browse Books</h1>
            <p className={styles.pageSub}>Explore our collection and borrow a book today</p>
          </div>
          <Link href="/member/dashboard" className={styles.dashboardBtn}>
            ← My Dashboard
          </Link>
        </div>

        {/* ── STAT ROW ── */}
        <div className={styles.statRow}>
          <div className={`${styles.statCard} ${styles.statCardBlue}`}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}>📚</div>
            <div className={styles.statValue}>{totalBooks}</div>
            <div className={styles.statLabel}>Total Books</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={`${styles.statIcon} ${styles.statIconGreen}`}>✅</div>
            <div className={styles.statValue}>{availableCount}</div>
            <div className={styles.statLabel}>Available</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardAmber}`}>
            <div className={`${styles.statIcon} ${styles.statIconAmber}`}>📖</div>
            <div className={styles.statValue}>{borrowedCount}</div>
            <div className={styles.statLabel}>Borrowed</div>
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search title, author, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filterWrap}>
            {filters.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f === 'ALL' ? 'All Books' : f === 'AVAILABLE' ? '✅ Available' : '📖 Borrowed'}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN CARD ── */}
        <div className={styles.mainCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>#</th>
                  <th className={styles.th}>Book</th>
                  <th className={styles.th}>Year</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Status</th>
                  <th className={`${styles.th} ${styles.thCenter}`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* SKELETON */}
                {loading && [1, 2, 3, 4].map((i) => (
                  <tr key={i} className={styles.tbodyTr}>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 20 }} /></td>
                    <td className={styles.td}>
                      <div className={styles.bookCell}>
                        <div className={styles.coverWrap} style={{ opacity: 0.3, background: '#e2e8f0' }} />
                        <div>
                          <div className={styles.skeleton} style={{ width: 160, marginBottom: 6 }} />
                          <div className={styles.skeleton} style={{ width: 100 }} />
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 40 }} /></td>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 80 }} /></td>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 70 }} /></td>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 70 }} /></td>
                  </tr>
                ))}

                {/* EMPTY */}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td className={styles.td} colSpan={6}>
                      <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>🔍</span>
                        <div className={styles.emptyTitle}>No books found</div>
                        <div className={styles.emptySub}>Try adjusting your search or filter</div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* DATA ROWS */}
                {!loading && filtered.map((book, i) => {
                  const isBorrowed = book.status === 'BORROWED';
                  return (
                    <tr key={book.id} className={styles.tbodyTr}>
                      <td className={styles.td} style={{ color: '#cbd5e1', fontWeight: 600 }}>
                        {String(i + 1).padStart(2, '0')}
                      </td>

                      <td className={styles.td}>
                        <div className={styles.bookCell}>
                          <div className={styles.coverWrap}>
                            {book.imageUrl ? (
                              <img
                                className={styles.coverImg}
                                src={`${process.env.NEXT_PUBLIC_API}${book.imageUrl}`}
                                alt={book.title}
                              />
                            ) : (
                              <div className={styles.noCover}>📖</div>
                            )}
                          </div>
                          <div className={styles.bookInfo}>
                            <span className={styles.bookTitle}>{book.title}</span>
                            <span className={styles.bookAuthor}>by {book.author}</span>
                          </div>
                        </div>
                      </td>

                      <td className={styles.td}>{book.publication_year}</td>

                      <td className={styles.td}>
                        <span className={styles.catChip}>{book.category?.name || '—'}</span>
                      </td>

                      <td className={styles.td}>
                        {isBorrowed ? (
                          <span className={`${styles.badge} ${styles.badgeBorrowed}`}>
                            <span className={styles.badgeDot} />Borrowed
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeAvailable}`}>
                            <span className={styles.badgeDot} />Available
                          </span>
                        )}
                      </td>

                      <td className={`${styles.td} ${styles.tdCenter}`}>
                        {!isBorrowed && (
                          <button
                            className={styles.borrowBtn}
                            onClick={() => { setSelectedBook(book); setConfirmOpen(true); }}
                          >
                            + Borrow
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── CONFIRM MODAL ── */}
      {confirmOpen && selectedBook && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>📚</div>
            <h2 className={styles.modalTitle}>Confirm Borrow</h2>
            <p className={styles.modalBody}>
              You are about to borrow:{' '}
              <span className={styles.modalBookTitle}>{selectedBook.title}</span>
            </p>
            <p className={styles.modalNote}>
              Loan period: 14 days · Please return on time
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => { setConfirmOpen(false); setSelectedBook(null); }}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={confirmBorrow}
                disabled={confirming}
              >
                {confirming ? 'Processing...' : '✓ Confirm Borrow'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}