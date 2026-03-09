'use client';

type Props = { count: number };

export default function OverdueAlert({ count }: Props) {
  if (count === 0) return null;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3.5 mb-6 rounded-2xl
        bg-red-50 border border-red-200 text-red-700 text-sm font-medium
        transition-all duration-300
        opacity-100 translate-y-0
      `} 
    >
      <span className="text-lg flex-shrink-0">⚠️</span>
      <span>
        You have <strong>{count}</strong> overdue book{count > 1 ? 's' : ''}.
        Please return {count > 1 ? 'them' : 'it'} as soon as possible.
      </span>
    </div>
  );
} 