'use client';
import { useEffect, useState } from 'react';

type Props = { total: number };

export default function CategoryStats({ total }: Props) {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(total / 20));
    const iv = setInterval(() => {
      cur += step;
      if (cur >= total) { setCount(total); clearInterval(iv); }
      else setCount(cur);
    }, 40);
    return () => clearInterval(iv);
  }, [visible, total]);

  return (
    <div className={`
      flex items-center gap-4 p-5 rounded-2xl border
      bg-purple-50 border-purple-100
      transition-all duration-500 ease-out w-full sm:w-64
      hover:shadow-md hover:-translate-y-0.5
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
        🗂️
      </div>
      <div>
        <div className="text-2xl font-bold tabular-nums text-purple-700">{count}</div>
        <div className="text-sm text-slate-500 font-medium">Total Categories</div>
      </div>
    </div>
  );
}