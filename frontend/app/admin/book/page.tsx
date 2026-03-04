'use client';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

import BookFormCard from '@/components/Admin/book/BookFormCard';
import BookTable    from '@/components/Admin/book/BookTable';
import { Book, Category, EMPTY_BOOK } from '@/components/Admin/book/bookTypes';

export default function BooksPage() {
  const [books,      setBooks]      = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [imageFile,  setImageFile]  = useState<File | null>(null);
  const [isEditing,  setIsEditing]  = useState(false);
  const [form,       setForm]       = useState<Book>(EMPTY_BOOK);

  /* ── Load ── */
  const loadBooks = async () => {
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API}/book`, { credentials: 'include' });
      const json = await res.json();
      setBooks(Array.isArray(json.data) ? json.data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API}/cate`, { credentials: 'include' });
      const json = await res.json();
      setCategories(Array.isArray(json.data) ? json.data : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadBooks(); loadCategories(); }, []);

  /* ── Helpers ── */
  const resetForm = () => { setForm(EMPTY_BOOK); setIsEditing(false); setImageFile(null); };

  const uploadImage = async (bookId: number) => {
    if (!imageFile) return;
    const fd = new FormData();
    fd.append('image', imageFile);
    await fetch(`${process.env.NEXT_PUBLIC_API}/book/${bookId}/image`, {
      method: 'POST', credentials: 'include', body: fd,
    });
    setImageFile(null);
  };

  /* ── Submit ── */
  const submitBook = async () => {
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url    = isEditing
        ? `${process.env.NEXT_PUBLIC_API}/book/${form.id}`
        : `${process.env.NEXT_PUBLIC_API}/book`;

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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

  /* ── Delete ── */
  const deleteBook = async (id: number) => {
    if (!confirm('Delete this book?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/book/${id}`, {
        method: 'DELETE', credentials: 'include',
      });
      if (!res.ok) { alert('Delete failed'); return; }
      loadBooks();
    } catch (err) { console.error(err); }
  };

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()),
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading books…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── TOP BAR ── */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Library</div>
          <h1 className="flex items-center gap-2.5 text-3xl font-bold text-slate-800 mb-1">
            <BookOpen size={26} className="text-blue-500" />
            Books Management
          </h1>
          <p className="text-slate-400 text-sm">Add, edit, and manage your book catalogue</p>
        </div>

        {/* ── FORM ── */}
        <BookFormCard
          form={form}
          categories={categories}
          isEditing={isEditing}
          imageFile={imageFile}
          onChange={setForm}
          onImageChange={setImageFile}
          onSubmit={submitBook}
          onCancel={resetForm}
        />

        {/* ── TABLE ── */}
        <BookTable
          books={filtered}
          total={books.length}
          search={search}
          categories={categories}
          onSearchChange={setSearch}
          onEdit={(b) => { setForm(b); setIsEditing(true); setImageFile(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onDelete={deleteBook}
        />
      </div>
    </div>
  );
}