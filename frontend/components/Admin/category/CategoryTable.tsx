'use client';
import { LayoutList, FolderOpen } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide
import CategoryRow, { Category } from './CategoryRow';

type Props = {
  categories: Category[];
  total: number;
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
};

export default function CategoryTable({ categories, total, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg border border-purple-100 text-purple-600">
            <LayoutList size={18} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm tracking-tight">Category Management</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {categories.length} of {total} categories defined
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['ID', 'Category Name', 'Actions'].map((h) => (
                <th 
                  key={h} 
                  className={`px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest ${
                    h === 'Actions' ? 'text-right' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 max-w-[280px] mx-auto">
                    {/* เปลี่ยน Emoji เป็น FolderOpen Icon ในกล่อง Soft Purple */}
                    <div className="w-16 h-16 rounded-[2rem] bg-purple-50 flex items-center justify-center text-purple-300 ring-8 ring-purple-50/50">
                      <FolderOpen size={32} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-900 tracking-tight">No categories found</div>
                      <div className="text-sm text-slate-500 leading-relaxed font-medium">
                        Your library doesnt have any categories yet. Create one to start organizing books.
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((c, i) => (
                <CategoryRow 
                  key={c.id} 
                  category={c} 
                  index={i} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Displaying {categories.length} entries
        </span>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
             System Updated
           </span>
        </div>
      </div>
    </div>
  );
}