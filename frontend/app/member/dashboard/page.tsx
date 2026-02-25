'use client';
// BooksListPage - book.module.css version
import { useEffect, useState } from 'react';
import ProtectedLayout from '../../Protected';
import Link from 'next/link';
import styles from './borrowed.module.css';

type Borrowed = {
  id: number;
  memberId: number;
  bookId: number;
  loanDate: string;
  returnDate?: string | null;
  status: 'BORROWED' | 'RETURNED';
  book: {
    title: string;
    author: string;
    publication_year: string;
  };
};

function getDaysLeft(loanDate: string): number {
  const loan = new Date(loanDate);
  const due = new Date(loan);
  due.setDate(due.getDate() + 14);
  const now = new Date();
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function MemberBorrowedPage() {
  const [borrows, setBorrows] = useState<Borrowed[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<number | null>(null);
  const [tab, setTab] = useState<'active' | 'history'>('active');

  const loadBorrowByMember = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/borrow/member`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setBorrows([]); return; }
      const json = await res.json();
      setBorrows(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturned = async (borrowId: number, bookId: number) => {
    setReturningId(borrowId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/borrow/return/${borrowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookId }),
      });
      if (!res.ok) return;
      const json = await res.json();
      setBorrows(Array.isArray(json.data) ? json.data : []);
    } finally {
      setReturningId(null);
    }
  };

  useEffect(() => { loadBorrowByMember(); }, []);

  const active = borrows.filter((b) => b.status === 'BORROWED');
  const history = borrows.filter((b) => b.status === 'RETURNED');
  const overdueCount = active.filter((b) => getDaysLeft(b.loanDate) < 0).length;
  const dueSoonCount = active.filter((b) => {
    const d = getDaysLeft(b.loanDate);
    return d >= 0 && d <= 3;
  }).length;

  const displayed = tab === 'active' ? active : history;

  return (
    <ProtectedLayout>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className={styles.dashRoot}>
        {/* ── PAGE HEADER ── */}
        <div className={styles.pageHeader}>
          <div className={styles.pageTitleWrap}>
            <div className={styles.pageEyebrow}>My Library</div>
            <h1 className={styles.pageTitle}>Borrowed Books</h1>
            <p className={styles.pageSub}>Manage your current loans and borrowing history</p>
          </div>
          <Link href="/member/book" className={styles.browseBtn}>
            <span>📚</span> Browse Books
          </Link>
        </div>

        {/* ── STAT ROW ── */}
        <div className={styles.statRow}>
          <div className={`${styles.statCard} ${styles.statCardBlue}`}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}>📖</div>
            <div className={styles.statValue}>{active.length}</div>
            <div className={styles.statLabel}>Currently Borrowed</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={`${styles.statIcon} ${styles.statIconGreen}`}>✅</div>
            <div className={styles.statValue}>{history.length}</div>
            <div className={styles.statLabel}>Books Returned</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardAmber}`}>
            <div className={`${styles.statIcon} ${styles.statIconAmber}`}>⏰</div>
            <div className={styles.statValue}>{dueSoonCount}</div>
            <div className={styles.statLabel}>Due Soon (3 days)</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCardRed}`}>
            <div className={`${styles.statIcon} ${styles.statIconRed}`}>⚠️</div>
            <div className={styles.statValue}>{overdueCount}</div>
            <div className={styles.statLabel}>Overdue</div>
          </div>
        </div>

        {/* ── OVERDUE ALERT ── */}
        {overdueCount > 0 && (
          <div className={styles.alertBanner}>
            ⚠️ You have {overdueCount} overdue book{overdueCount > 1 ? 's' : ''}. Please return them as soon as possible.
          </div>
        )}

        {/* ── MAIN CARD ── */}
        <div className={styles.mainCard}>
          <div className={styles.cardTop}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${tab === 'active' ? styles.tabBtnActive : styles.tabBtnNotActive}`}
                onClick={() => setTab('active')}
              >
                Active <span className={styles.tabCount}>{active.length}</span>
              </button>
              <button
                className={`${styles.tabBtn} ${tab === 'history' ? styles.tabBtnActive : styles.tabBtnNotActive}`}
                onClick={() => setTab('history')}
              >
                History <span className={styles.tabCount}>{history.length}</span>
              </button>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>#</th>
                  <th className={styles.th}>Book</th>
                  <th className={styles.th}>Loan Date</th>
                  <th className={styles.th}>{tab === 'active' ? 'Due Date' : 'Return Date'}</th>
                  <th className={styles.th}>Status</th>
                  {tab === 'active' && <th className={styles.th}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {/* ── SKELETON ── */}
                {loading && [1, 2, 3].map((i) => (
                  <tr key={i} className={styles.skeletonRow}>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 20 }} /></td>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 180 }} /></td>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 90 }} /></td>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 90 }} /></td>
                    <td className={styles.td}><div className={styles.skeleton} style={{ width: 80 }} /></td>
                    {tab === 'active' && <td className={styles.td}><div className={styles.skeleton} style={{ width: 80 }} /></td>}
                  </tr>
                ))}

                {/* ── EMPTY ── */}
                {!loading && displayed.length === 0 && (
                  <tr>
                    <td className={styles.td} colSpan={tab === 'active' ? 6 : 5}>
                      <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>{tab === 'active' ? '📭' : '📋'}</span>
                        <div className={styles.emptyTitle}>
                          {tab === 'active' ? 'No active loans' : 'No borrowing history yet'}
                        </div>
                        <div className={styles.emptySub}>
                          {tab === 'active'
                            ? 'Browse our collection and borrow a book!'
                            : 'Your returned books will appear here.'}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* ── ROWS ── */}
                {!loading && displayed.map((b, i) => {
                  const daysLeft = getDaysLeft(b.loanDate);
                  const isOverdue = daysLeft < 0;
                  const isDueSoon = daysLeft >= 0 && daysLeft <= 3;

                  const loanDateStr = new Date(b.loanDate).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  });

                  const dueDate = new Date(b.loanDate);
                  dueDate.setDate(dueDate.getDate() + 14);

                  const returnDateStr = b.returnDate
                    ? new Date(b.returnDate).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })
                    : '—';

                  const dueChipClass = isOverdue
                    ? `${styles.dueChip} ${styles.dueOverdue}`
                    : isDueSoon
                    ? `${styles.dueChip} ${styles.dueSoon}`
                    : `${styles.dueChip} ${styles.dueOk}`;

                  const badgeClass = b.status === 'BORROWED'
                    ? isOverdue
                      ? `${styles.badge} ${styles.badgeOverdue}`
                      : `${styles.badge} ${styles.badgeBorrowed}`
                    : `${styles.badge} ${styles.badgeReturned}`;

                  return (
                    <tr key={b.id} className={styles.tbodyTr}>
                      <td className={`${styles.td} ${styles.numCell}`}>
                        {String(i + 1).padStart(2, '0')}
                      </td>

                      <td className={styles.td}>
                        <div className={styles.bookCell}>
                          <span className={styles.bookTitleTd}>{b.book.title}</span>
                          <span className={styles.bookAuthorTd}>by {b.book.author}</span>
                        </div>
                      </td>

                      <td className={styles.td}>{loanDateStr}</td>

                      <td className={styles.td}>
                        {tab === 'active' ? (
                          <span className={dueChipClass}>
                            {isOverdue
                              ? `⚠️ ${Math.abs(daysLeft)}d overdue`
                              : isDueSoon
                              ? `⏰ ${daysLeft}d left`
                              : `✓ ${daysLeft}d left`}
                          </span>
                        ) : returnDateStr}
                      </td>

                      <td className={styles.td}>
                        <span className={badgeClass}>
                          <span className={styles.badgeDot} />
                          {b.status === 'BORROWED'
                            ? isOverdue ? 'Overdue' : 'Borrowed'
                            : 'Returned'}
                        </span>
                      </td>

                      {tab === 'active' && (
                        <td className={styles.td}>
                          <button
                            className={styles.returnBtn}
                            onClick={() => handleReturned(b.id, b.bookId)}
                            disabled={returningId === b.id}
                          >
                            {returningId === b.id ? '⟳ Returning...' : '↩ Return'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}