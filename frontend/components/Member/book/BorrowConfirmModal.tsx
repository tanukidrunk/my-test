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
        {/* Icon */}
        <div className="flex justify-center mb-4 text-4xl">
          📚
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-slate-800 mb-2">
          Confirm Borrow
        </h2>

        {/* Book info */}
        <p className="text-center text-sm text-slate-500 mb-6">
          Do you want to borrow
        </p>

        <div className="bg-slate-50 rounded-xl p-4 text-center mb-6">
          <p className="font-semibold text-slate-800">
            {book.title}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            by {book.author}
          </p>
        </div>

        {/* Note */}
        <p className="text-xs text-slate-400 text-center mb-6">
          This book must be returned within <span className="font-medium text-slate-600">7 days</span>.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="
              flex-1 py-2.5 rounded-xl text-sm font-semibold
              bg-slate-100 hover:bg-slate-200 text-slate-700
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={confirming}
            className="
              flex-1 py-2.5 rounded-xl text-sm font-semibold
              bg-slate-800 hover:bg-slate-700 text-white
              transition flex items-center justify-center gap-2
              disabled:opacity-70
            "
          >
            {confirming ? (
              <>
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Borrowing...
              </>
            ) : (
              'Borrow'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}