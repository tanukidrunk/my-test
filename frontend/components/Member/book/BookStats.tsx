'use client';
import { useEffect, useState } from 'react';

type Props = {
  total: number;
  available: number;
  borrowed: number;
};

type StatCardProps = {
  icon: string;
  value: number;
  label: string;
  color: 'blue' | 'green' | 'amber';
  delay?: number;
};

const colorMap = {
  blue: {
    card: 'bg-blue-50 border-blue-100',
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-700',
  },
  green: {
    card: 'bg-emerald-50 border-emerald-100',
    icon: 'bg-emerald-100 text-emerald-600',
    value: 'text-emerald-700',
  },
  amber: {
    card: 'bg-amber-50 border-amber-100',
    icon: 'bg-amber-100 text-amber-600',
    value: 'text-amber-700',
  },
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
    let start = 0;
    const step = Math.ceil(value / 20);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(interval); }
      else setCount(start);
    }, 40);
    return () => clearInterval(interval);
  }, [visible, value]);

  return (
    <div
      className={`
        flex items-center gap-4 p-5 rounded-2xl border ${c.card}
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        hover:shadow-md hover:-translate-y-0.5
      `}
    >
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

export default function BookStats({ total, available, borrowed }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard icon="📚" value={total}     label="Total Books" color="blue"  delay={0}   />
      <StatCard icon="✅" value={available} label="Available"   color="green" delay={80}  />
      <StatCard icon="📖" value={borrowed}  label="Borrowed"    color="amber" delay={160} />
    </div>
  );
}