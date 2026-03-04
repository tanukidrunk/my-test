'use client';
import { useEffect, useRef } from 'react';
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

  // ✅ Effect นี้ถูกต้อง เพราะมัน sync กับ DOM (focus)
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
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-200
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7
          transition-all duration-300
          ${open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">
            {isEditing ? '✏️' : '➕'}
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-800 text-center mb-5">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </h2>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            Category Name
          </label>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter category name…"
            value={form.name}
            onChange={(e) =>
              onFormChange({ ...form, name: e.target.value })
            }
            onKeyDown={handleKey}
            className="
              w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white
              text-sm text-slate-700 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400
              transition-all duration-200
            "
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="
              flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600
              hover:bg-slate-50 transition-all duration-150 active:scale-95
            "
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={!form.name.trim()}
            className="
              flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-purple-600 hover:bg-purple-700
              transition-all duration-150 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-sm hover:shadow-purple-200 hover:shadow-md
            "
          >
            {isEditing ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </div>
    </div>
  );
}