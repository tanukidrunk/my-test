'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Search, Pencil, Trash2, Plus, X } from 'lucide-react';
import styles from './adminbook.module.css';

type Book = {
  id: number;
  title: string;
  author: string;
  publication_year: string;
  categoryId: number;
  imageUrl?: string | null;
};

type Category = {
  id: number;
  name: string;
};

export default function BooksPage() {
  const [books, setBooks]         = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm]           = useState<Book>({
    id: 0, title: '', author: '', publication_year: '', categoryId: 0,
  });

  const loadBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/book`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setBooks(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setCategories(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadBooks(); loadCategories(); }, []);

  const resetForm = () => {
    setForm({ id: 0, title: '', author: '', publication_year: '', categoryId: 0 });
    setIsEditing(false);
    setImageFile(null);
  };

  const submitBook = async () => {
    try {
      const token  = localStorage.getItem('token');
      const method = isEditing ? 'PUT' : 'POST';
      const url    = isEditing
        ? `${process.env.NEXT_PUBLIC_API}/book/${form.id}`
        : `${process.env.NEXT_PUBLIC_API}/book`;

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      let json: { data?: { id: number }; message?: string };
      try { json = JSON.parse(text); } catch { alert('Server error'); return; }
      if (!res.ok) { alert(json.message || 'Failed'); return; }

      const bookId = isEditing ? form.id : json.data!.id;
      if (imageFile) await uploadImage(bookId);

      resetForm();
      loadBooks();
    } catch (err) { console.error(err); }
  };

  const deleteBook = async (id: number) => {
    if (!confirm('Delete this book?')) return;
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${process.env.NEXT_PUBLIC_API}/book/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert('Delete failed'); return; }
      loadBooks();
    } catch (err) { console.error(err); }
  };

  const editBook = (b: Book) => { setForm(b); setIsEditing(true); setImageFile(null); };

  const uploadImage = async (bookId: number) => {
    if (!imageFile) return;
    const token    = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', imageFile);
    await fetch(`${process.env.NEXT_PUBLIC_API}/book/${bookId}/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    setImageFile(null);
  };

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingSpinner} />
        <span className={styles.loadingText}>Loading books…</span>
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
            <BookOpen size={28} className={styles.pageTitleIcon} />
            Books Management
          </h1>
          <p className={styles.pageSub}>Add, edit, and manage your book catalogue</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className={styles.formCard}>
        <div className={styles.formCardTop}>
          <div className={styles.formCardIcon}>📚</div>
          <div>
            <div className={styles.formCardTitle}>
              {isEditing ? 'Edit Book' : 'Add New Book'}
            </div>
            <div className={styles.formCardSub}>
              {isEditing ? `Editing: ${form.title}` : 'Fill in the details to add a new book'}
            </div>
          </div>
        </div>

        <div className={styles.formBody}>
          <div>
            <label className={styles.formLabel}>Title</label>
            <input
              className={styles.formInput}
              placeholder='Book title…'
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className={styles.formLabel}>Author</label>
            <input
              className={styles.formInput}
              placeholder='Author name…'
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
          </div>

          <div>
            <label className={styles.formLabel}>Publication Year</label>
            <input
              className={styles.formInput}
              placeholder='e.g. 2023'
              value={form.publication_year}
              onChange={(e) => setForm({ ...form, publication_year: e.target.value })}
            />
          </div>

          <div>
            <label className={styles.formLabel}>Category</label>
            <select
              className={styles.formSelect}
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            >
              <option value={0}>Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formColFull}>
            <label className={styles.formLabel}>Cover Image</label>
            <input
              type='file'
              accept='image/*'
              className={styles.fileInput}
              onChange={(e) => {
                if (e.target.files?.[0]) setImageFile(e.target.files[0]);
              }}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button className={styles.submitBtn} onClick={submitBook}>
            <Plus size={15} />
            {isEditing ? 'Save Changes' : 'Add Book'}
          </button>
          {isEditing && (
            <button className={styles.cancelBtn} onClick={resetForm}>
              <X size={14} />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* TABLE CARD */}
      <div className={styles.mainCard}>
        <div className={styles.mainCardTop}>
          <div>
            <div className={styles.mainCardTitle}>Book List</div>
            <div className={styles.mainCardSub}>{filtered.length} of {books.length} books</div>
          </div>
          <div className={styles.searchWrap}>
            <Search size={13} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder='Search title or author…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Cover</th>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Title</th>
                <th className={styles.th}>Author</th>
                <th className={styles.th}>Year</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.emptyState}>
                      <span className={styles.emptyIcon}>📖</span>
                      <div className={styles.emptyTitle}>No books found</div>
                      <div className={styles.emptySub}>Add your first book using the form above</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const catName = categories.find((c) => c.id === b.categoryId)?.name ?? 'Unknown';
                  return (
                    <tr key={b.id} className={styles.tbodyTr}>
                      <td className={styles.td}>
                        {b.imageUrl ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API}${b.imageUrl}`}
                            className={styles.bookCover}
                            alt={b.title}
                          />
                        ) : (
                          <div className={styles.noCover}>📖</div>
                        )}
                      </td>
                      <td className={`${styles.td} ${styles.idCell}`}>#{b.id}</td>
                      <td className={styles.td}>
                        <div className={styles.bookTitleWrap}>
                          <span className={styles.bookTitle}>{b.title}</span>
                        </div>
                      </td>
                      <td className={styles.td}>{b.author}</td>
                      <td className={styles.td}>
                        <span className={styles.yearChip}>📅 {b.publication_year}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.catChip}>{catName}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionWrap}>
                          <button className={styles.editBtn} onClick={() => editBook(b)}>
                            <Pencil size={13} /> Edit
                          </button>
                          <button className={styles.deleteBtn} onClick={() => deleteBook(b.id)}>
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <span>Showing {filtered.length} books</span>
          <span>Last updated just now</span>
        </div>
      </div>
    </div>
  );
}