'use client';
import { useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Book, Category, EMPTY_BOOK } from './bookTypes';

type Props = {
  form: Book;
  categories: Category[];
  isEditing: boolean;
  imageFile: File | null;
  onChange: (f: Book) => void;
  onImageChange: (file: File | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const inputCls = `
  w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white
  text-sm text-slate-700 placeholder:text-slate-400
  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
  transition-all duration-200
`;

const labelCls = 'block text-sm font-medium text-slate-600 mb-1.5';

export default function BookFormCard({
  form, categories, isEditing, imageFile,
  onChange, onImageChange, onSubmit, onCancel,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canSubmit = form.title.trim() && form.author.trim() && form.categoryId > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">
          📚
        </div>
        <div>
          <div className="font-semibold text-slate-800 text-sm">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {isEditing ? `Editing: ${form.title}` : 'Fill in the details to add a new book'}
          </div>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelCls}>Title</label>
          <input
            className={inputCls}
            placeholder="Book title…"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className={labelCls}>Author</label>
          <input
            className={inputCls}
            placeholder="Author name…"
            value={form.author}
            onChange={(e) => onChange({ ...form, author: e.target.value })}
          />
        </div>

        <div>
          <label className={labelCls}>Publication Year</label>
          <input
            className={inputCls}
            placeholder="e.g. 2023"
            value={form.publication_year}
            onChange={(e) => onChange({ ...form, publication_year: e.target.value })}
          />
        </div>

        <div>
          <label className={labelCls}>Category</label>
          <select
            className={inputCls}
            value={form.categoryId}
            onChange={(e) => onChange({ ...form, categoryId: Number(e.target.value) })}
          >
            <option value={0}>Select category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Cover Image</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="
              flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-slate-300
              cursor-pointer hover:border-blue-400 hover:bg-blue-50/50
              transition-all duration-200 group
            "
          >
            <span className="text-2xl">{imageFile ? '🖼️' : '📂'}</span>
            <span className="text-sm text-slate-500 group-hover:text-blue-600">
              {imageFile ? imageFile.name : 'Click to choose cover image…'}
            </span>
            {imageFile && (
              <button
                className="ml-auto text-slate-400 hover:text-red-500 transition-colors"
                onClick={(e) => { e.stopPropagation(); onImageChange(null); if (fileRef.current) fileRef.current.value = ''; }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
            bg-blue-600 hover:bg-blue-700
            transition-all duration-150 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-sm hover:shadow-blue-200 hover:shadow-md
          "
        >
          <Plus size={15} />
          {isEditing ? 'Save Changes' : 'Add Book'}
        </button>
        {isEditing && (
          <button
            onClick={onCancel}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              border border-slate-200 text-slate-600 hover:bg-slate-50
              transition-all duration-150 active:scale-95
            "
          >
            <X size={14} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}