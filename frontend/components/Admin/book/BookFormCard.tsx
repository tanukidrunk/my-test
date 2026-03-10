'use client';
import { useRef } from 'react';
import { Plus, X, Library, Image, FileUp, Check, Save } from 'lucide-react';
import { Book, Category } from './bookTypes';

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
  text-sm text-slate-800 placeholder:text-slate-400
  focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400
  transition-all duration-200
`;

const labelCls = 'block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1';

export default function BookFormCard({
  form, categories, isEditing, imageFile,
  onChange, onImageChange, onSubmit, onCancel,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canSubmit = form.title.trim() && form.author.trim() && form.categoryId > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
          <Library size={20} strokeWidth={2} />
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm">
            {isEditing ? 'Edit Book Details' : 'Add New Book'}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {isEditing ? `Modifying: ${form.title}` : 'Fill in the information to expand the library'}
          </div>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div>
          <label className={labelCls}>Book Title</label>
          <input
            className={inputCls}
            placeholder="e.g. The Great Gatsby"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className={labelCls}>Author Name</label>
          <input
            className={inputCls}
            placeholder="e.g. F. Scott Fitzgerald"
            value={form.author}
            onChange={(e) => onChange({ ...form, author: e.target.value })}
          />
        </div>

        <div>
          <label className={labelCls}>Publication Year</label>
          <input
            className={inputCls}
            placeholder="e.g. 1925"
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
            <option value={0}>Select a category</option>
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
              flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200
              cursor-pointer hover:border-slate-400 hover:bg-slate-50
              transition-all duration-200 group relative
            "
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${imageFile ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
              {imageFile ? <Image size={20} /> : <FileUp size={20} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-700 truncate">
                {imageFile ? imageFile.name : 'Upload cover image'}
              </div>
              <div className="text-[11px] text-slate-400">
                {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : 'Recommended: 400x600px'}
              </div>
            </div>

            {imageFile && (
              <button
                className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onImageChange(null); 
                  if (fileRef.current) fileRef.current.value = ''; 
                }}
              >
                <X size={16} />
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
      <div className="flex items-center gap-3 border-t border-slate-100 pt-6">
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="
            flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white
            bg-slate-900 hover:bg-slate-800
            transition-all duration-200 active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg shadow-slate-200
          "
        >
          {isEditing ? <Save size={16} /> : <Plus size={16} />}
          {isEditing ? 'Save Changes' : 'Create Book'}
        </button>
        
        {isEditing && (
          <button
            onClick={onCancel}
            className="
              flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold
              border border-slate-200 text-slate-600 hover:bg-slate-50
              transition-all duration-200 active:scale-[0.98]
            "
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}