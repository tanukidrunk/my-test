'use client';
import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Book, Category } from './bookTypes';

type Props = {
  book: Book;
  index: number;
  categories: Category[];
  onEdit: (b: Book) => void;
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
        <div className="w-9 h-12 rounded-lg overflow-hidden bg-slate-100 shadow-sm flex-shrink-0">
          {b.imageUrl ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API}${b.imageUrl}`}
              alt={b.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-base">📖</div>
          )}
        </div>
      </td>

      {/* ID */}
      <td className="px-4 py-3 w-16">
        <span className="text-xs font-semibold text-slate-400 tabular-nums">#{b.id}</span>
      </td>

      {/* Title */}
      <td className="px-4 py-3">
        <span className="text-sm font-semibold text-slate-800 line-clamp-1 max-w-[180px] block">{b.title}</span>
      </td>

      {/* Author */}
      <td className="px-4 py-3">
        <span className="text-sm text-slate-500">{b.author}</span>
      </td>

      {/* Year */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          📅 {b.publication_year}
        </span>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {catName}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(b)}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              bg-blue-50 text-blue-600 hover:bg-blue-100
              transition-all duration-150 active:scale-90
            "
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(b.id)}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              bg-red-50 text-red-500 hover:bg-red-100
              transition-all duration-150 active:scale-90
            "
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}