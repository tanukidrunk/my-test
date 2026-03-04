'use client';
import { useEffect, useState } from 'react';
import { Member } from './memberTypes';
import GenderBadge from './GenderBadge';

const avatarColors = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
  'bg-rose-500',  'bg-amber-500',  'bg-cyan-500',
];

type Props = { member: Member; index: number };

export default function MemberRow({ member: m, index }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 40);
    return () => clearTimeout(t);
  }, [index]);

  const avatarColor = avatarColors[m.id % avatarColors.length];

  return (
    <tr className={`
      border-b border-slate-100 last:border-0
      transition-all duration-300 ease-out hover:bg-slate-50/80
      ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
    `}>
      <td className="px-4 py-3.5 w-16">
        <span className="text-xs font-semibold text-slate-400 tabular-nums">#{m.id}</span>
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {m.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-slate-800">{m.username}</span>
        </div>
      </td>

      <td className="px-4 py-3.5">
        <span className="text-sm text-slate-500">{m.email}</span>
      </td>

      <td className="px-4 py-3.5">
        <GenderBadge gender={m.gender} />
      </td>
    </tr>
  );
}