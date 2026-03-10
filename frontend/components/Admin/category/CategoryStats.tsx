'use client';
import { useEffect, useState } from 'react';
import { Tags } from 'lucide-react'; // นำเข้าไอคอน Tags จาก Lucide

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
      if (cur >= total) {
        setCount(total);
        clearInterval(iv);
      } else {
        setCount(cur);
      }
    }, 40);
    return () => clearInterval(iv);
  }, [visible, total]);

  return (
    <div className={`
      flex items-center gap-4 p-5 rounded-2xl border
      bg-purple-50 border-purple-100
      transition-all duration-500 ease-out w-full sm:w-72
      hover:shadow-md hover:-translate-y-0.5
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {/* เปลี่ยน Emoji เป็น Lucide Icon */}
      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
        <Tags size={24} strokeWidth={2} />
      </div>
      
      <div>
        <div className="text-2xl font-bold tabular-nums text-purple-700">{count}</div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Total Categories
        </div>
      </div>
    </div>
  );
}