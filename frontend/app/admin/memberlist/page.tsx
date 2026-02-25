'use client';
import { useEffect, useState } from 'react';
import { UserRound, RefreshCw, Search } from 'lucide-react';
import styles from './memberlist.module.css';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

type Member = {
  id: number;
  email: string;
  username: string;
  gender: Gender;
};

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/member`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setMembers(Array.isArray(json.data) ? json.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filtered = members.filter(
    (m) =>
      m.username.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const maleCount   = members.filter((m) => m.gender === 'MALE').length;
  const femaleCount = members.filter((m) => m.gender === 'FEMALE').length;
  const otherCount  = members.filter((m) => m.gender === 'OTHER').length;

  const genderBadge = (g: Gender) => {
    const cls =
      g === 'MALE'   ? styles.badgeMale :
      g === 'FEMALE' ? styles.badgeFemale : styles.badgeOther;
    const label = g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Other';
    return (
      <span className={`${styles.badge} ${cls}`}>
        <span className={styles.badgeDot} />
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingSpinner} />
        <span className={styles.loadingText}>Loading members…</span>
      </div>
    );
  }

  return (
    <div className={styles.pageRoot}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div>
          <p className={styles.pageEyebrow}>People</p>
          <h1 className={styles.pageTitle}>
            <UserRound size={28} className={styles.pageTitleIcon} />
            Member Management
          </h1>
          <p className={styles.pageSub}>Manage all registered members and their profiles</p>
        </div>
        <div className={styles.topBarRight}>
          <button className={styles.refreshBtn} onClick={loadMembers}>
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* STAT ROW */}
      <div className={styles.statRow}>
        {/* Total */}
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}>👥</div>
            <span className={styles.statTrend}>Total</span>
          </div>
          <div className={styles.statValue}>{members.length}</div>
          <div className={styles.statLabel}>All Members</div>
          <div className={styles.statBar}>
            <div className={`${styles.statBarFill} ${styles.statBarBlue}`} style={{ width: '100%' }} />
          </div>
        </div>

        {/* Male */}
        <div className={`${styles.statCard} ${styles.statCardBlue}`}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconBlue}`}>♂️</div>
          </div>
          <div className={styles.statValue}>{maleCount}</div>
          <div className={styles.statLabel}>Male</div>
          <div className={styles.statBar}>
            <div
              className={`${styles.statBarFill} ${styles.statBarBlue}`}
              style={{ width: members.length ? `${(maleCount / members.length) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Female */}
        <div className={`${styles.statCard} ${styles.statCardPink}`}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconPink}`}>♀️</div>
          </div>
          <div className={styles.statValue}>{femaleCount}</div>
          <div className={styles.statLabel}>Female</div>
          <div className={styles.statBar}>
            <div
              className={`${styles.statBarFill} ${styles.statBarPink}`}
              style={{ width: members.length ? `${(femaleCount / members.length) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Other */}
        <div className={`${styles.statCard} ${styles.statCardGray}`}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconGray}`}>⚧️</div>
          </div>
          <div className={styles.statValue}>{otherCount}</div>
          <div className={styles.statLabel}>Other</div>
          <div className={styles.statBar}>
            <div
              className={`${styles.statBarFill} ${styles.statBarGray}`}
              style={{ width: members.length ? `${(otherCount / members.length) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* MAIN TABLE CARD */}
      <div className={styles.mainCard}>
        <div className={styles.mainCardTop}>
          <div>
            <div className={styles.mainCardTitle}>Members List</div>
            <div className={styles.mainCardSub}>{filtered.length} of {members.length} members</div>
          </div>
          <div className={styles.searchWrap}>
            <Search size={13} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder='Search name or email…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Member</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Gender</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className={styles.emptyState}>
                      <span className={styles.emptyIcon}>👤</span>
                      <div className={styles.emptyTitle}>No members found</div>
                      <div className={styles.emptySub}>Try adjusting your search</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className={styles.tbodyTr}>
                    <td className={`${styles.td} ${styles.idCell}`}>#{m.id}</td>
                    <td className={styles.td}>
                      <div className={styles.entityCell}>
                        <div className={styles.entityAvatar}>
                          {m.username.charAt(0).toUpperCase()}
                        </div>
                        <span className={styles.entityName}>{m.username}</span>
                      </div>
                    </td>
                    <td className={styles.td}>{m.email}</td>
                    <td className={styles.td}>{genderBadge(m.gender)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <span>Showing {filtered.length} members</span>
          <span>Last updated just now</span>
        </div>
      </div>
    </div>
  );
}