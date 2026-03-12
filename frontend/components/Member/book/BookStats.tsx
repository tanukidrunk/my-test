'use client';
import { useEffect, useState } from 'react';
import { Library, CheckCircle, BookOpen, LucideIcon } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide

type Props = {
  total: number;
  available: number;
  borrowed: number;
};

type StatCardProps = {
  icon: LucideIcon; // เปลี่ยนจาก string เป็น LucideIcon
  value: number;
  label: string;
  color: 'blue' | 'green' | 'amber';
  delay?: number;
};
 
const colorMap = {
  blue: {
    card: 'bg-blue-50/50 border-blue-100',
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-700',
  }, 
  green: {
    card: 'bg-emerald-50/50 border-emerald-100',
    icon: 'bg-emerald-100 text-emerald-600',
    value: 'text-emerald-700',
  },
  amber: {
    card: 'bg-amber-50/50 border-amber-100',
    icon: 'bg-amber-100 text-amber-600',
    value: 'text-amber-700',
  },
};
 
function StatCard({ icon: Icon, value, label, color, delay = 0 }: StatCardProps) {
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
    const step = Math.max(1, Math.ceil(value / 20)); // ป้องกัน step เป็น 0
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(start);
      }
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
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.icon} flex-shrink-0`}>
        {/* Render Icon Component */}
        <Icon size={24} strokeWidth={2} />
      </div>
      <div>
        <div className={`text-2xl font-bold tabular-nums ${c.value}`}>{count}</div>
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

export default function BookStats({ total, available, borrowed }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard 
        icon={Library} 
        value={total}     
        label="Total Books" 
        color="blue"  
        delay={0}   
      />
      <StatCard 
        icon={CheckCircle} 
        value={available} 
        label="Available"   
        color="green" 
        delay={80}  
      />
      <StatCard 
        icon={BookOpen} 
        value={borrowed}  
        label="Borrowed"    
        color="amber" 
        delay={160} 
      />
    </div>
  );
}