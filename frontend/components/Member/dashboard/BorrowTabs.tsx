'use client';

type Tab = 'active' | 'history';

type Props = {
  active: Tab;
  onChange: (t: Tab) => void;
  activeCount: number;
  historyCount: number; 
};
  
export default function BorrowTabs({ active, onChange, activeCount, historyCount }: Props) {
  return (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
      {(['active', 'history'] as Tab[]).map((t) => {
        const isActive = active === t;
        const count = t === 'active' ? activeCount : historyCount;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isActive
                ? 'bg-white text-slate-800 shadow-sm scale-[1.02]'
                : 'text-slate-500 hover:text-slate-700'}
            `}
          >
            {t === 'active' ? 'Active' : 'History'}
            <span className={`
              px-1.5 py-0.5 rounded-full text-xs font-semibold tabular-nums
              ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}
            `}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}