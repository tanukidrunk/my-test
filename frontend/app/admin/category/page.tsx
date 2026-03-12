'use client';
import { useState, useEffect } from 'react';
import { Layers, Plus, Search } from 'lucide-react';
import { apiFetch } from '@/app/lib/api/token';
import CategoryStats from '@/components/Admin/category/CategoryStats';
import CategoryTable from '@/components/Admin/category/CategoryTable';
import CategoryModal from '@/components/Admin/category/CategoryModal';
import { Category }  from '@/components/Admin/category/CategoryRow';
 
export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [open,       setOpen]       = useState(false);
  const [isEditing,  setIsEditing]  = useState(false);
  const [form,       setForm]       = useState<Category>({ id: 0, name: '' });
 
  /* ── load ── */
const loadCategory = async () => {
  setLoading(true);
  try {
    const json = await apiFetch('/cate');
    setCategories(Array.isArray(json.data) ? json.data : []);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => { loadCategory(); }, []);

  /* ── modal helpers ── */
  const openAdd = () => { setForm({ id: 0, name: '' }); setIsEditing(false); setOpen(true); };
  const openEdit = (cat: Category) => { setForm(cat); setIsEditing(true); setOpen(true); };

  /* ── submit ── */
const submitCategory = async () => {
  const endpoint = isEditing
    ? `/cate/${form.id}`
    : `/cate/Addcategory`;

  await apiFetch(endpoint, {
    method: isEditing ? 'PUT' : 'POST',
    body: JSON.stringify({ name: form.name }),
  });

  setOpen(false);
  loadCategory();
};

  /* ── delete ── */
const deleteCategory = async (id: number) => {
  if (!confirm('Delete this category?')) return;

  await apiFetch(`/cate/${id}`, {
    method: 'DELETE',
  });

  loadCategory();
};

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ── loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-[3px] border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading categories…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* ── TOP BAR ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-1">Library</div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800 mb-1">
              <Layers size={26} className="text-purple-500" />
              Category Management
            </h1>
            <p className="text-slate-400 text-sm">Organise book categories and genres</p>
          </div>
          <button
            onClick={openAdd}
            className="
              flex-shrink-0 mt-1 flex items-center gap-2 px-4 py-2 rounded-xl
              bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold
              transition-all duration-150 active:scale-95 shadow-sm hover:shadow-purple-200 hover:shadow-md
            "
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="mb-6">
          <CategoryStats total={categories.length} />
        </div>

        {/* ── SEARCH ── */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
              text-sm text-slate-700 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400
              transition-all duration-200
            "
          />
        </div>

        {/* ── TABLE ── */}
        <CategoryTable
          categories={filtered}
          total={categories.length}
          onEdit={openEdit}
          onDelete={deleteCategory}
        />
      </div>

      {/* ── MODAL ── */}
      <CategoryModal
        open={open}
        isEditing={isEditing}
        form={form}
        onFormChange={setForm}
        onSubmit={submitCategory}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}