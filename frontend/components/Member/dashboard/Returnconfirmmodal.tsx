'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BookMarked, Undo2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      />

      {/* Panel */}
      <div className="
        relative z-10 w-full max-w-sm
        bg-white rounded-2xl shadow-2xl border border-slate-100
        animate-[modalIn_0.18s_ease-out]
      ">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-300 rounded-t-2xl" />

        <div className="p-6">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => !loading && onCancel()}
            disabled={loading}
            className="absolute top-4 right-4 h-7 w-7 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X size={15} />
          </Button>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
            <Undo2 size={22} className="text-slate-600" strokeWidth={2} />
          </div>

          <h2 id="modal-title" className="text-lg font-bold text-slate-800 mb-1">
            Return this book?
          </h2>
          <p className="text-sm text-slate-400 mb-5">
            Please confirm that you are returning the following book to the library.
          </p>

          {/* Book card */}
          <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-6">
            <div className="mt-0.5 text-slate-400 shrink-0">
              <BookMarked size={22} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 text-sm leading-snug truncate">
                {bookTitle}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">by {bookAuthor}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              ref={cancelRef}
              variant="outline"
              disabled={loading}
              onClick={onCancel}
              className="flex-1 rounded-xl font-semibold text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>

            <Button
              disabled={loading}
              onClick={onConfirm}
              className="flex-1 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-white shadow-sm active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Returning…
                </>
              ) : (
                <>
                  <Undo2 size={14} className="mr-2" />
                  Confirm Return
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>,
    document.body
  );
}