'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  bookTitle: string;
  bookAuthor: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ReturnConfirmModal({
  open,
  bookTitle,
  bookAuthor,
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  /* trap focus & Esc key */
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return createPortal(
    (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={() => !loading && onCancel()}
      />

      {/* panel */}
      <div className="
        relative z-10 w-full max-w-sm
        bg-white rounded-2xl shadow-2xl border border-slate-100
        animate-[modalIn_0.18s_ease-out]
      ">
        {/* top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-300 rounded-t-2xl" />

        <div className="p-6">
          {/* icon */}
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl mb-4">
            ↩
          </div>

          <h2 id="modal-title" className="text-lg font-bold text-slate-800 mb-1">
            Return this book?
          </h2>
          <p className="text-sm text-slate-400 mb-5">
            Please confirm that you are returning the following book to the library.
          </p>

          {/* book card */}
          <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-6">
            <span className="text-2xl mt-0.5">📚</span>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 text-sm leading-snug truncate">{bookTitle}</div>
              <div className="text-xs text-slate-400 mt-0.5">by {bookAuthor}</div>
            </div>
          </div>

          {/* actions */}
          <div className="flex gap-3">
            <button
              ref={cancelRef}
              onClick={onCancel}
              disabled={loading}
              className="
                flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
                border border-slate-200 bg-white text-slate-600
                hover:bg-slate-50 hover:border-slate-300
                transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="
                flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
                bg-slate-800 hover:bg-slate-700 text-white
                transition-all duration-150 active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-sm flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Returning…
                </>
              ) : (
                'Confirm Return'
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  ), document.body);
}