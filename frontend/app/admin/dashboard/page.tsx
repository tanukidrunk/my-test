'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './admindashboard.module.css';

type Borrowed = {
  id: number;
  memberId: number;
  bookId: number;
  loanDate: string;
  returnDate?: string | null;
  status: 'BORROWED' | 'RETURNED';
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminDashboard() {
  const [borrowed, setBorrowed] = useState<Borrowed[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadBorrowed = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/borrow`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setBorrowed(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error('Error loading borrowed:', err);
      setBorrowed([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          router.replace('/login');
          return;
        }
        const json = await res.json();
        const member = json.member ?? json.data?.member;
        if (!member || member.role !== 'ADMIN') {
          router.replace('/login');
          return;
        }
        loadBorrowed();
      })
      .catch(() => router.replace('/login'));
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  const total = borrowed.length;
  const active = borrowed.filter((b) => b.status === 'BORROWED').length;
  const returned = borrowed.filter((b) => b.status === 'RETURNED').length;
  const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;
  const returnRate = total > 0 ? Math.round((returned / total) * 100) : 0;

  const filtered = borrowed.filter((b) => {
    const q = search.toLowerCase();
    return (
      String(b.id).includes(q) ||
      String(b.memberId).includes(q) ||
      String(b.bookId).includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <link
        href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
        rel='stylesheet'
      />

      <div className={styles.pageRoot}>
        {/* ── TOP BAR ── */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.pageEyebrow}>Admin Panel</div>
            <h1 className={styles.pageTitle}>Borrowed Dashboard</h1>
            <p className={styles.pageSub}>
              Monitor all borrow records in real-time
            </p>
          </div>
          <div className={styles.topBarRight}>
            <button
              className={styles.refreshBtn}
              onClick={() => loadBorrowed(true)}
              disabled={refreshing}
            >
              {refreshing ? '⟳ Refreshing...' : '↻ Refresh'}
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className={styles.statRow}>
          {/* Total */}
          <div className={`${styles.statCard} ${styles.statCardBlue}`}>
            <div className={styles.statTop}>
              <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
                📋
              </div>
              <span className={styles.statTrend}>All</span>
            </div>
            <div className={styles.statValue}>{total}</div>
            <div className={styles.statLabel}>Total Records</div>
            <div className={styles.statBar}>
              <div
                className={`${styles.statBarFill} ${styles.statBarBlue}`}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Active */}
          <div className={`${styles.statCard} ${styles.statCardAmber}`}>
            <div className={styles.statTop}>
              <div className={`${styles.statIcon} ${styles.statIconAmber}`}>
                📖
              </div>
              <span className={styles.statTrend}>{activeRate}%</span>
            </div>
            <div className={styles.statValue}>{active}</div>
            <div className={styles.statLabel}>Currently Borrowed</div>
            <div className={styles.statBar}>
              <div
                className={`${styles.statBarFill} ${styles.statBarAmber}`}
                style={{ width: `${activeRate}%` }}
              />
            </div>
          </div>

          {/* Returned */}
          <div className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={styles.statTop}>
              <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                ✅
              </div>
              <span className={styles.statTrend}>{returnRate}%</span>
            </div>
            <div className={styles.statValue}>{returned}</div>
            <div className={styles.statLabel}>Returned</div>
            <div className={styles.statBar}>
              <div
                className={`${styles.statBarFill} ${styles.statBarGreen}`}
                style={{ width: `${returnRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── TABLE CARD ── */}
        <div className={styles.mainCard}>
          <div className={styles.mainCardTop}>
            <div>
              <div className={styles.mainCardTitle}>Borrow Records</div>
              <div className={styles.mainCardSub}>
                Showing {filtered.length} of {total} records
              </div>
            </div>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                className={styles.searchInput}
                type='text'
                placeholder='Search ID, member, book...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Borrow ID</th>
                  <th className={styles.th}>Member</th>
                  <th className={styles.th}>Book</th>
                  <th className={styles.th}>Loan Date</th>
                  <th className={styles.th}>Return Date</th>
                  <th className={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty */}
                {filtered.length === 0 && (
                  <tr>
                    <td className={styles.td} colSpan={6}>
                      <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>📭</span>
                        <div className={styles.emptyTitle}>
                          No records found
                        </div>
                        <div className={styles.emptySub}>
                          {search
                            ? 'Try a different search term'
                            : 'No borrow records yet'}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Rows */}
                {filtered.map((b) => (
                  <tr key={b.id} className={styles.tbodyTr}>
                    {/* ID */}
                    <td className={styles.td}>
                      <span className={styles.idCell}>
                        #{String(b.id).padStart(4, '0')}
                      </span>
                    </td>

                    {/* Member */}
                    <td className={styles.td}>
                      <div className={styles.entityCell}>
                        <div className={styles.entityAvatar}>
                          {String(b.memberId).slice(-2)}
                        </div>
                        <span className={styles.entityId}>
                          Member {b.memberId}
                        </span>
                      </div>
                    </td>

                    {/* Book */}
                    <td className={styles.td}>
                      <div className={styles.entityCell}>
                        <div
                          className={`${styles.entityAvatar} ${styles.entityAvatarBook}`}
                        >
                          📕
                        </div>
                        <span className={styles.entityId}>Book {b.bookId}</span>
                      </div>
                    </td>

                    {/* Loan Date */}
                    <td className={styles.td}>
                      <span className={styles.dateCell}>
                        {formatDate(b.loanDate)}
                      </span>
                    </td>

                    {/* Return Date */}
                    <td className={styles.td}>
                      {b.returnDate ? (
                        <span className={styles.dateCell}>
                          {formatDate(b.returnDate)}
                        </span>
                      ) : (
                        <span className={styles.dateDash}>—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className={styles.td}>
                      {b.status === 'BORROWED' ? (
                        <span
                          className={`${styles.badge} ${styles.badgeBorrowed}`}
                        >
                          <span className={styles.badgeDot} />
                          Borrowed
                        </span>
                      ) : (
                        <span
                          className={`${styles.badge} ${styles.badgeReturned}`}
                        >
                          <span className={styles.badgeDot} />
                          Returned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableFooter}>
            <span>
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
            <span>
              Active: {active} · Returned: {returned}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
