'use client';
import CategoryRow, { Category } from './CategoryRow';

type Props = {
  categories: Category[];
  total: number;
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
};

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="px-4 py-3.5"><div className="h-3 w-8 bg-slate-200 rounded" /></td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-slate-200" />
          <div className="h-3 w-32 bg-slate-200 rounded" />
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200" />
          <div className="w-8 h-8 rounded-lg bg-slate-200" />
        </div>
      </td>
    </tr>
  );
}

export default function CategoryTable({ categories, total, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <div className="font-semibold text-slate-800 text-sm">Category List</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {categories.length} of {total} categories
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['ID', 'Category Name', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">🗂️</span>
                    <div className="font-semibold text-slate-600">No categories found</div>
                    <div className="text-sm text-slate-400">Create your first category to get started</div>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((c, i) => (
                <CategoryRow key={c.id} category={c} index={i} onEdit={onEdit} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-slate-400">Showing {categories.length} categories</span>
        <span className="text-xs text-slate-400">Last updated just now</span>
      </div>
    </div>
  );
}