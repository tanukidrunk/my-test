'use client';
import { Book } from './BookRow';

type Props = {
  book: Book | null;
  open: boolean;
  confirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function BorrowConfirmModal({
  book,
  open,
  confirming,
  onConfirm,
  onCancel,
}: Props) {
  if (!book) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-200
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onCancel}
    >
      <div
        className={`
          relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8
          transition-all duration-300
          ${open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* content เดิมทั้งหมด */}
      </div>
    </div>
  );
}