'use client';
import { Search, LayoutGrid, CheckCircle2, BookOpen } from 'lucide-react';

type FilterType = 'ALL' | 'AVAILABLE' | 'BORROWED';

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
}; 
 
// ปรับโครงสร้าง filters ให้รองรับ Icon Component
const filters = [
  { value: 'ALL', label: 'All Books', icon: LayoutGrid },
  { value: 'AVAILABLE', label: 'Available', icon: CheckCircle2 },
  { value: 'BORROWED', label: 'Borrowed', icon: BookOpen },
] as const;

export default function BookToolbar({ search, onSearchChange, activeFilter, onFilterChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
      {/* Search Input Area */}
      <div className="relative w-full sm:flex-1 group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-slate-900 text-slate-400">
          <Search size={18} strokeWidth={2} />
        </div>
        <input
          type="text"
          placeholder="Search title, author, category..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
            text-sm text-slate-800 placeholder:text-slate-400
            focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400
            transition-all duration-200 shadow-sm
          "
        />
      </div>

      {/* Filter Pills */}
      <div className="flex w-full sm:w-auto p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
        {filters.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.value;
          
          return (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`
                flex-1 sm:flex-none flex items-center justify-center gap-2
                px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300
                ${isActive 
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-200/50 translate-y-[-1px]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}
              `}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              <span className="hidden xs:inline">{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
} 