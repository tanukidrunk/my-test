'use client';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Book, Calendar } from 'lucide-react'; // นำเข้าไอคอนเพิ่ม
import { Book as BookType, Category } from './bookTypes';

type Props = {
  book: BookType;
  index: number;
  categories: Category[];
  onEdit: (b: BookType) => void;
  onDelete: (id: number) => void;
};

export default function BookRow({ book: b, index, categories, onEdit, onDelete }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 40);
    return () => clearTimeout(t);
  }, [index]);

  const catName = categories.find((c) => c.id === b.categoryId)?.name ?? 'Unknown';

  return (
    <tr className={`
      border-b border-slate-100 last:border-0
      transition-all duration-300 ease-out hover:bg-slate-50/80
      ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
    `}>
      {/* Cover */}
      <td className="px-4 py-3 w-14">
        <div className="w-10 h-14 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shadow-sm flex-shrink-0 flex items-center justify-center">
          {b.imageUrl ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API}${b.imageUrl}`}
              alt={b.title}
              className="w-full h-full object-cover"
            />
          ) : (
            // เปลี่ยน 📖 เป็น Book icon
            <Book size={18} className="text-slate-300" strokeWidth={1.5} />
          )}
        </div>
      </td>

      {/* ID */}
      <td className="px-4 py-3 w-16">
        <span className="text-[11px] font-bold text-slate-400 tabular-nums uppercase tracking-tighter">
          #{String(b.id).padStart(3, '0')}
        </span>
      </td>

      {/* Title & Author */}
      <td className="px-4 py-3">
        <div className="flex flex-col min-w-[150px]">
          <span className="text-sm font-bold text-slate-900 line-clamp-1 truncate uppercase tracking-tight">
            {b.title}
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase">
            {b.author}
          </span>
        </div>
      </td>

      {/* Year */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
          {/* เปลี่ยน 📅 เป็น Calendar icon */}
          <Calendar size={12} strokeWidth={2.5} />
          {b.publication_year}
        </span>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
          {catName}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(b)}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase
              bg-slate-900 text-white hover:bg-slate-800
              transition-all duration-150 active:scale-95 shadow-sm
            "
          >
            <Pencil size={12} strokeWidth={2.5} />
            Edit
          </button>
          <button
            onClick={() => onDelete(b.id)}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase
              bg-red-50 text-red-600 hover:bg-red-100 border border-red-100
              transition-all duration-150 active:scale-95
            "
          >
            <Trash2 size={12} strokeWidth={2.5} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}