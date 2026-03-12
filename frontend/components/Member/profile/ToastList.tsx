'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide
import { Toast } from './profileTypes';
 
type Props = { toasts: Toast[] };

function ToastItem({ toast }: { toast: Toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const isSuccess = toast.type === 'success';

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold
      transition-all duration-500 ease-out backdrop-blur-md
      ${isSuccess
        ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900 shadow-emerald-100/50'
        : 'bg-red-50/90 border-red-200 text-red-900 shadow-red-100/50'}
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:translate-x-4'}
    `}>
      <div className={`flex-shrink-0 ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
        {isSuccess ? (
          <CheckCircle2 size={18} strokeWidth={2.5} />
        ) : (
          <AlertCircle size={18} strokeWidth={2.5} />
        )}
      </div>
      <span className="leading-tight">{toast.message}</span>
    </div>
  );
}

export default function ToastList({ toasts }: Props) {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-[calc(100vw-3rem)] sm:max-w-sm w-full">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}