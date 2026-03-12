import { Gender } from './memberTypes';

const map: Record<Gender, { label: string; cls: string; dot: string }> = {
  MALE:   { label: 'Male',   cls: 'bg-blue-100 text-blue-700',  dot: 'bg-blue-400'  },
  FEMALE: { label: 'Female', cls: 'bg-pink-100 text-pink-700',  dot: 'bg-pink-400'  },
  OTHER:  { label: 'Other',  cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
};
 
export default function GenderBadge({ gender }: { gender: Gender }) {
  const { label, cls, dot } = map[gender];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}