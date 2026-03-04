'use client';
import { useEffect, useState } from 'react';
import { Borrowed } from './borrowedTypes';

type Props = { borrowed: Borrowed[] };

type CardProps = {
  icon: string;
  value: number;
  label: string;
  pct: number;
  color: 'blue' | 'amber' | 'green';
  delay?: number;
};

const colorMap = {
  blue:  { card: 'bg-blue-50 border-blue-100',    icon: 'bg-blue-100',    value: 'text-blue-700',    bar: 'bg-blue-400'   },
  amber: { card: 'bg-amber-50 border-amber-100',  icon: 'bg-amber-100',   value: 'text-amber-700',   bar: 'bg-amber-400'  },
  green: { card: 'bg-emerald-50 border-emerald-100', icon: 'bg-emerald-100', value: 'text-emerald-700', bar: 'bg-emerald-400' },
};

function StatCard({ icon, value, label, pct, color, delay = 0 }: CardProps) {
  const [visible, setVisible] = useState(false);
  const [count,   setCount]   = useState(0);
  const [barW,    setBarW]    = useState(0);
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
    const bt = setTimeout(() => setBarW(pct), 120);
    return () => { clearInterval(iv); clearTimeout(bt); };
  }, [visible, value, pct]);

  return (
    <div className={`
      flex flex-col gap-3 p-5 rounded-2xl border ${c.card}
      transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-0.5
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${c.icon}`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-400">{pct}%</span>
      </div>
      <div>
        <div className={`text-2xl font-bold tabular-nums ${c.value}`}>{count}</div>
        <div className="text-sm text-slate-500 font-medium">{label}</div>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${c.bar}`}
          style={{ width: `${barW}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardStats({ borrowed }: Props) {
  const total     = borrowed.length;
  const active    = borrowed.filter((b) => b.status === 'BORROWED').length;
  const returned  = borrowed.filter((b) => b.status === 'RETURNED').length;
  const activeRate = total > 0 ? Math.round((active   / total) * 100) : 0;
  const returnRate = total > 0 ? Math.round((returned / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard icon="📋" value={total}    label="Total Records"      pct={100}        color="blue"  delay={0}   />
      <StatCard icon="📖" value={active}   label="Currently Borrowed" pct={activeRate} color="amber" delay={80}  />
      <StatCard icon="✅" value={returned} label="Returned"           pct={returnRate} color="green" delay={160} />
    </div>
  );
}