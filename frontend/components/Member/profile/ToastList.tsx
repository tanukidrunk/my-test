'use client';
import { useEffect, useState } from 'react';
import { Toast } from './profileTypes';

type Props = { toasts: Toast[] };

function ToastItem({ toast }: { toast: Toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium
      transition-all duration-300 ease-out
      ${toast.type === 'success'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
        : 'bg-red-50 border-red-200 text-red-800'}
      ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
    `}>
      <span className="text-base flex-shrink-0">
        {toast.type === 'success' ? '✅' : '❌'}
      </span>
      <span>{toast.message}</span>
    </div>
  );
}

export default function ToastList({ toasts }: Props) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}