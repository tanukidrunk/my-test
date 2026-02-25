'use client';
import { useState, useEffect } from 'react';
import { Layers, Plus, Search, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import styles from './admincate.module.css';

type Category = {
  id: number;
  name: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Category>({ id: 0, name: '' });

  const loadCategory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setCategories(Array.isArray(json.data) ? json.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategory();
  }, []);

  const openAddModal = () => {
    setForm({ id: 0, name: '' });
    setIsEditing(false);
    setOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setForm(cat);
    setIsEditing(true);
    setOpen(true);
  };

  const submitCategory = async () => {
    const token = localStorage.getItem('token');
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API}/cate/${form.id}`
      : `${process.env.NEXT_PUBLIC_API}/cate/Addcategory`;

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: form.name }),
    });
    setOpen(false);
    loadCategory();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API}/cate/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    loadCategory();
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingSpinner} />
        <span className={styles.loadingText}>Loading categories…</span>
      </div>
    );
  }

  return (
    <div className={styles.pageRoot}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div>
          <p className={styles.pageEyebrow}>Library</p>
          <h1 className={styles.pageTitle}>
            <Layers size={28} className={styles.pageTitleIcon} />
            Category Management
          </h1>
          <p className={styles.pageSub}>Organise book categories and genres</p>
        </div>
        <div className={styles.topBarRight}>
          <button className={styles.addBtn} onClick={openAddModal}>
            <Plus size={15} />
            Add Category
          </button>
        </div>
      </div>

      {/* STAT ROW */}
      <div className={styles.statRow}>
        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
          <div className={styles.statTop}>
            <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
              🗂️
            </div>
            <span className={styles.statTrend}>Total</span>
          </div>
          <div className={styles.statValue}>{categories.length}</div>
          <div className={styles.statLabel}>Categories</div>
          <div className={styles.statBar}>
            <div
              className={`${styles.statBarFill} ${styles.statBarPurple}`}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className={styles.mainCard}>
        <div className={styles.mainCardTop}>
          <div>
            <div className={styles.mainCardTitle}>Category List</div>
            <div className={styles.mainCardSub}>
              {filtered.length} of {categories.length} categories
            </div>
          </div>
          <div className={styles.searchWrap}>
            <Search size={13} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder='Search categories…'
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
                <th className={styles.th}>Category Name</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <div className={styles.emptyState}>
                      <span className={styles.emptyIcon}>🗂️</span>
                      <div className={styles.emptyTitle}>
                        No categories found
                      </div>
                      <div className={styles.emptySub}>
                        Create your first category to get started
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className={styles.tbodyTr}>
                    <td className={`${styles.td} ${styles.idCell}`}>#{c.id}</td>
                    <td className={styles.td}>
                      <div className={styles.catNameCell}>
                        <span className={styles.catDot} />
                        <span className={styles.catName}>{c.name}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionWrap}>
                        <button
                          className={styles.editBtn}
                          onClick={() => openEditModal(c)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => deleteCategory(c.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <span>Showing {filtered.length} categories</span>
          <span>Last updated just now</span>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h2>
            <input
              className={styles.modalInput}
              placeholder='Category name…'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={submitCategory}>
                {isEditing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
