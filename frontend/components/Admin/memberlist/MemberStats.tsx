'use client';
import { useEffect, useState } from 'react';
import { Member } from './memberTypes';

type Props = { members: Member[] };

type StatCardProps = {
  icon: string;
  value: number;
  total: number;
  label: string;
  color: 'blue' | 'pink' | 'slate';
  delay?: number;
};

const colorMap = {
  blue:  { card: 'bg-blue-50 border-blue-100',    icon: 'bg-blue-100',    value: 'text-blue-700',    bar: 'bg-blue-400'  },
  pink:  { card: 'bg-pink-50 border-pink-100',    icon: 'bg-pink-100',    value: 'text-pink-700',    bar: 'bg-pink-400'  },
  slate: { card: 'bg-slate-50 border-slate-200',  icon: 'bg-slate-100',   value: 'text-slate-700',   bar: 'bg-slate-400' },
};

function StatCard({ icon, value, total, label, color, delay = 0 }: StatCardProps) {
  const [visible, setVisible] = useState(false);
  const [count,   setCount]   = useState(0);
  const [barW,    setBarW]    = useState(0);
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
      if (cur >= value) { setCount(value); clearInterval(iv); }
      else setCount(cur);
    }, 40);
    // animate bar slightly later
    const bt = setTimeout(() => setBarW(pct), 100);
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

export default function MemberStats({ members }: Props) {
  const total  = members.length;
  const male   = members.filter((m) => m.gender === 'MALE').length;
  const female = members.filter((m) => m.gender === 'FEMALE').length;
  const other  = members.filter((m) => m.gender === 'OTHER').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <StatCard icon="👥" value={total}  total={total}  label="All Members" color="blue"  delay={0}   />
      <StatCard icon="♂️"  value={male}   total={total}  label="Male"        color="blue"  delay={80}  />
      <StatCard icon="♀️"  value={female} total={total}  label="Female"      color="pink"  delay={160} />
      <StatCard icon="⚧️" value={other}  total={total}  label="Other"       color="slate" delay={240} />
    </div>
  );
}