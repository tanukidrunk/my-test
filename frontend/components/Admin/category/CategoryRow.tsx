'use client';
import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export type Category = { id: number; name: string };

type Props = {
  category: Category;
  index: number;
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
};
 
export default function CategoryRow({ category: c, index, onEdit, onDelete }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 40);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <tr className={`
      border-b border-slate-100 last:border-0
      transition-all duration-300 ease-out hover:bg-slate-50/80
      ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
    `}>
      {/* ID */}
      <td className="px-4 py-3.5 w-20">
        <span className="text-xs font-semibold text-slate-400 tabular-nums">#{c.id}</span>
      </td>

      {/* Name */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-700">{c.name}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(c)}
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              bg-blue-50 text-blue-600 hover:bg-blue-100
              transition-all duration-150 active:scale-90
            "
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(c.id)}
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              bg-red-50 text-red-500 hover:bg-red-100
              transition-all duration-150 active:scale-90
            "
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}