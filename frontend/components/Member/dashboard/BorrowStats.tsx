'use client';
import { useEffect, useState } from 'react';

type Props = {
  active: number;
  returned: number;
  dueSoon: number;
  overdue: number;
};

type StatCardProps = {
  icon: string;
  value: number;
  label: string;
  color: 'blue' | 'green' | 'amber' | 'red';
  delay?: number;
};

const colorMap = {
  blue:  { card: 'bg-blue-50 border-blue-100',    icon: 'bg-blue-100 text-blue-600',    value: 'text-blue-700'   },
  green: { card: 'bg-emerald-50 border-emerald-100', icon: 'bg-emerald-100 text-emerald-600', value: 'text-emerald-700' },
  amber: { card: 'bg-amber-50 border-amber-100',  icon: 'bg-amber-100 text-amber-600',  value: 'text-amber-700'  },
  red:   { card: 'bg-red-50 border-red-100',      icon: 'bg-red-100 text-red-600',      value: 'text-red-700'    },
};

function StatCard({ icon, value, label, color, delay = 0 }: StatCardProps) {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const c = colorMap[color];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(value / 20));
    const iv = setInterval(() => {
      cur += step;
      if (cur >= value) { setCount(value); clearInterval(iv); }
      else setCount(cur);
    }, 40);
    return () => clearInterval(iv);
  }, [visible, value]);

  return (
    <div className={`
      flex items-center gap-4 p-5 rounded-2xl border ${c.card}
      transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-0.5
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${c.icon} flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <div className={`text-2xl font-bold tabular-nums ${c.value}`}>{count}</div>
        <div className="text-sm text-slate-500 font-medium">{label}</div>
      </div>
    </div>
  );
}

export default function BorrowStats({ active, returned, dueSoon, overdue }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <StatCard icon="📖" value={active}   label="Currently Borrowed" color="blue"  delay={0}   />
      <StatCard icon="✅" value={returned} label="Books Returned"      color="green" delay={80}  />
      <StatCard icon="⏰" value={dueSoon}  label="Due Soon (3 days)"   color="amber" delay={160} />
      <StatCard icon="⚠️" value={overdue}  label="Overdue"             color="red"   delay={240} />
    </div>
  );
}