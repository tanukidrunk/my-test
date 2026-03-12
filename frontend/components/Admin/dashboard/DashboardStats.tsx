'use client';
import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, History, LucideIcon } from 'lucide-react';
import { Borrowed } from './borrowedTypes';

type Props = { borrowed: Borrowed[] };

type CardProps = {
  icon: LucideIcon; // เปลี่ยนจาก string เป็น LucideIcon type
  value: number;
  label: string;
  pct: number;
  color: 'blue' | 'amber' | 'green';
  delay?: number;
};

const colorMap = {
  blue: { 
    card: 'bg-blue-50/50 border-blue-100', 
    icon: 'bg-blue-100 text-blue-600', 
    value: 'text-blue-700', 
    bar: 'bg-blue-500'  
  },
  amber: { 
    card: 'bg-amber-50/50 border-amber-100', 
    icon: 'bg-amber-100 text-amber-600', 
    value: 'text-amber-700', 
    bar: 'bg-amber-500' 
  },
  green: { 
    card: 'bg-emerald-50/50 border-emerald-100', 
    icon: 'bg-emerald-100 text-emerald-600', 
    value: 'text-emerald-700', 
    bar: 'bg-emerald-500' 
  },
};

function StatCard({ icon: Icon, value, label, pct, color, delay = 0 }: CardProps) {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [barW, setBarW] = useState(0);
  const c = colorMap[color];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;
    
    // Animation สำหรับตัวเลข
    let cur = 0;
    const step = Math.max(1, Math.ceil(value / 20));
    const iv = setInterval(() => {
      cur += step;
      if (cur >= value) {
        setCount(value);
        clearInterval(iv);
      } else {
        setCount(cur);
      }
    }, 40);

    // Animation สำหรับ Progress Bar
    const bt = setTimeout(() => setBarW(pct), 200);
    
    return () => {
      clearInterval(iv);
      clearTimeout(bt);
    };
  }, [visible, value, pct]);

  return (
    <div className={`
      flex flex-col gap-4 p-5 rounded-2xl border ${c.card}
      transition-all duration-500 ease-out hover:shadow-md hover:-translate-y-0.5
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon} shadow-sm border border-white/50`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rate</span>
          <span className="text-sm font-bold text-slate-600">{pct}%</span>
        </div>
      </div>
      
      <div>
        <div className={`text-3xl font-bold tabular-nums tracking-tight ${c.value}`}>
          {count.toLocaleString()}
        </div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
          {label}
        </div>
      </div>

      <div className="h-2 rounded-full bg-slate-200/50 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${c.bar} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
          style={{ width: `${barW}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardStats({ borrowed }: Props) {
  const total      = borrowed.length;
  const active     = borrowed.filter((b) => b.status === 'BORROWED').length;
  const returned   = borrowed.length - active; // คำนวณจากยอดที่ไม่ได้ถูกยืมอยู่
  
  const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;
  const returnRate = total > 0 ? Math.round((returned / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <StatCard 
        icon={History} 
        value={total} 
        label="Total Transactions" 
        pct={100} 
        color="blue" 
        delay={0} 
      />
      <StatCard 
        icon={BookOpen} 
        value={active} 
        label="Active Loans" 
        pct={activeRate} 
        color="amber" 
        delay={100} 
      />
      <StatCard 
        icon={CheckCircle2} 
        value={returned} 
        label="Completed Returns" 
        pct={returnRate} 
        color="green" 
        delay={200} 
      />
    </div>
  );
}