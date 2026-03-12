'use client';
import { useEffect, useState } from 'react';
import { Users, Mars, Venus, Transgender, LucideIcon } from 'lucide-react';
import { Member } from './memberTypes';

type Props = { members: Member[] };

type StatCardProps = {
  icon: LucideIcon; // เปลี่ยนจาก string เป็น LucideIcon type
  value: number;
  total: number;
  label: string;
  color: 'blue' | 'pink' | 'slate';
  delay?: number;
};
 
const colorMap = {
  blue:  { 
    card: 'bg-blue-50/50 border-blue-100', 
    icon: 'bg-blue-100 text-blue-600', 
    value: 'text-blue-700', 
    bar: 'bg-blue-500' 
  },
  pink:  { 
    card: 'bg-pink-50/50 border-pink-100', 
    icon: 'bg-pink-100 text-pink-600', 
    value: 'text-pink-700', 
    bar: 'bg-pink-500' 
  },
  slate: { 
    card: 'bg-slate-50/50 border-slate-200', 
    icon: 'bg-slate-100 text-slate-600', 
    value: 'text-slate-700', 
    bar: 'bg-slate-500' 
  },
};

function StatCard({ icon: Icon, value, total, label, color, delay = 0 }: StatCardProps) {
  const [visible, setVisible] = useState(false);
  const [count,  setCount]  = useState(0);
  const [barW,   setBarW]   = useState(0);
  const c = colorMap[color];
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

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
      if (cur >= value) {
        setCount(value);
        clearInterval(iv);
      } else {
        setCount(cur);
      }
    }, 40);
    
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
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{pct}%</span>
      </div>
      
      <div>
        <div className={`text-2xl font-bold tabular-nums tracking-tight ${c.value}`}>{count}</div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{label}</div>
      </div>

      <div className="h-1.5 rounded-full bg-slate-200/50 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${c.bar}`}
          style={{ width: `${barW}%` }}
        />
      </div>
    </div>
  );
}

export default function MemberStats({ members }: Props) {
  const total  = members.length;
  const male   = members.filter((m) => m.gender === 'MALE').length;
  const female = members.filter((m) => m.gender === 'FEMALE').length;
  const other  = total - (male + female);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <StatCard 
        icon={Users} 
        value={total}  
        total={total}  
        label="All Members" 
        color="blue"  
        delay={0}   
      />
      <StatCard 
        icon={Mars}  
        value={male}   
        total={total}  
        label="Male"         
        color="blue"  
        delay={80}  
      />
      <StatCard 
        icon={Venus}  
        value={female} 
        total={total}  
        label="Female"       
        color="pink"  
        delay={160} 
      />
      <StatCard 
        icon={Transgender} 
        value={other}  
        total={total}  
        label="Other"        
        color="slate" 
        delay={240} 
      />
    </div>
  );
}