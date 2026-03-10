'use client';

import { AlertCircle } from 'lucide-react'; // นำเข้าไอคอนจาก lucide-react

type Props = { count: number };

export default function OverdueAlert({ count }: Props) {
  if (count === 0) return null;

  return (
    <div
      className={`
        flex items-start sm:items-center gap-3 px-4 py-3.5 mb-6 rounded-2xl
        bg-red-50 border border-red-200 text-red-700 text-sm font-medium
        transition-all duration-300 animate-in fade-in slide-in-from-top-2
      `} 
    >
      {/* ปรับใช้ไอคอน AlertCircle แทน Emoji */}
      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
      
      <span>
        You have <strong>{count}</strong> overdue book{count > 1 ? 's' : ''}.
        Please return {count > 1 ? 'them' : 'it'} as soon as possible.
      </span>
    </div>
  );
}