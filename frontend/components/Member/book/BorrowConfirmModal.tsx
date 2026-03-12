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

  if (!open || !book) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
      "
    >
      <div
        className="
          relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8
          animate-in fade-in zoom-in duration-200
        "
      >

        {/* Title */}
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Confirm Borrow
        </h2>

        {/* Book info */}
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to borrow
          <span className="font-medium text-slate-700"> {book.title}</span> ?
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 text-sm rounded-lg
              border border-slate-200 text-slate-600
              hover:bg-slate-50
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={confirming}
            className="
              px-4 py-2 text-sm rounded-lg
              bg-blue-600 text-white
              hover:bg-blue-700
              disabled:opacity-50
            "
          >
            {confirming ? 'Borrowing...' : 'Confirm'}
          </button>
        </div>

      </div>
    </div>
  );
} 