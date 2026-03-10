'use client';
import { useEffect, useRef } from 'react';
import { PencilLine, Plus, Tag } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide
import { Category } from './CategoryRow';

type Props = {
  open: boolean;
  isEditing: boolean;
  form: Category;
  onFormChange: (f: Category) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export default function CategoryModal({
  open,
  isEditing,
  form,
  onFormChange,
  onSubmit,
  onClose,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && form.name.trim()) onSubmit();
    if (e.key === 'Escape') onClose();
  };

  if (!open) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-slate-950/40 backdrop-blur-sm
        transition-opacity duration-200
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8
          transition-all duration-300 ease-out border border-slate-100
          ${open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center ring-8 ring-purple-50/50">
            {isEditing ? (
              <PencilLine size={28} strokeWidth={2} />
            ) : (
              <Plus size={32} strokeWidth={2.5} />
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
            {isEditing ? 'Edit Category' : 'New Category'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {isEditing ? 'Update your category name' : 'Organize your books better'}
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 ml-1">
            Category Name
          </label>
          <div className="relative group">
            <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. Science Fiction"
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              onKeyDown={handleKey}
              className="
                w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white
                text-sm text-slate-800 placeholder:text-slate-400
                focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-400
                transition-all duration-200
              "
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onSubmit}
            disabled={!form.name.trim()}
            className="
              w-full py-3 rounded-2xl text-sm font-bold text-white
              bg-purple-600 hover:bg-purple-700
              transition-all duration-200 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-purple-100
            "
          >
            {isEditing ? 'Save Changes' : 'Create Category'}
          </button>
          
          <button
            onClick={onClose}
            className="
              w-full py-3 rounded-2xl text-sm font-bold text-slate-500
              hover:text-slate-800 hover:bg-slate-50
              transition-all duration-200 active:scale-[0.98]
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}